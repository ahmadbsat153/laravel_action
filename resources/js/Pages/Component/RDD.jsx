import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { PencilIcon } from "@heroicons/react/24/outline";
import ModalRDD from "@/Components/modalRDD";
import * as XLSX from "xlsx";
import moment from "moment";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import notFound from "../../assets/pictures/NotFound.png";
import Select from "react-select";
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function RDDreason({
    setActiveIndexGTRS,
    setactiveCon,
    debtorsData,
    rddData,
    url,
    setrddData,
    setLastIndex,
    accData,
    EDate,
    setEDate,
    SDate,
    setSDate,
    currentUser,
    rddReasons,
    oldestDate,
    latestDate,
}) {
    const [rddDataState, setrddDataState] = useState(rddData);
    const [isFetching, setIsFetching] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(() => {
        setrddDataState(rddData);
        filterData(SDate, EDate);
    }, [rddData]);
    const updateLocalData = (id, reason, note) => {
        // Find the item in the local data with the matching id
        const updatedData = rddDataState.map((item) => {
            if (item.ConsignmentId === id) {
                // Update the reason of the matching item
                return { ...item, Reason: reason, ReasonDesc: note };
            }
            return item;
        });
        // Update the state with the modified local data
        setrddDataState(updatedData);
        setrddData(updatedData);
    };
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(9);
        setactiveCon(coindex);
    };
    const uniqueDebtors = debtorsData.filter((debtor, index, array) => {
        return (
            array.findIndex((d) => d.DebtorName === debtor.DebtorName) === index
        );
    });
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: "800px", // Adjust the width to 100% for responsiveness
            // Add more styles here as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            // Add more styles here as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            width: "30%",
            overflow: "hidden",
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "75px", // Set the maximum height for the value container
            overflow: "auto", // Enable scrolling if the content exceeds the maximum height
            // fontSize: '10px',
        }),
        inputContainer: (provided) => ({
            ...provided,
        }),
        // Add more style functions here as needed
    };
    const handleResize = () => {
        const width = window.innerWidth;
        const controlWidth = width <= 768 ? "100%" : "100%"; // Adjust the width based on the viewport width
        const valueContainerMaxHeight = width <= 768 ? "none" : "75px"; // Disable maxHeight for smaller screens

        const responsiveStyles = {
            ...customStyles,
            control: (provided, state) => ({
                ...provided,
                width: controlWidth,
            }),
            valueContainer: (provided) => ({
                ...provided,
                maxHeight: valueContainerMaxHeight,
            }),
        };

        // Set the new responsive styles
        setStyles(responsiveStyles);
    };
    const [styles, setStyles] = React.useState(customStyles);
    React.useEffect(() => {
        // Attach the window resize event listener
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [rddDataState]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(rddDataState);

    const [selectedConsignment, setSelectedConsignment] = useState("");
    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setSDate(value);
        filterData(value, EDate, selectedConsignment);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEDate(value);
        // filterData(SDate, value);
        filterData(SDate, value, selectedConsignment);
    };
    const handleConsignmentChange = (value) => {
        setSelectedConsignment(value);
        filterData(SDate, EDate, value);
    };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleAutocompleteChange = (event, value) => {
        setSelectedOptions(value);
    };
    const filterData = (startDate, endDate) => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters and account data
        const filtered = rddDataState?.filter((item) => {
            const itemDate = new Date(item.DespatchDate); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const ConsNbMatch = selectedConsignment
                ? item.ConsignmentNo.includes(selectedConsignment)
                : true;
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.DebtorId);
            return (
                // chargeToMatch
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                ConsNbMatch &&
                chargeToMatch
            );
            // Compare the item date to the filter dates, check if receiver matches and if account matches
        });
        const hasData = filtered?.length > 0;
        setCurrentPage(0);
        setFilteredData(filtered);
    };
    useEffect(() => {
        filterData(SDate, EDate, selectedConsignment, selectedOptions);
    }, [
        rddData,
        accData,
        selectedOptions,
        rddDataState,
        selectedConsignment,
        SDate,
        EDate,
    ]);
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState([]);

    useLayoutEffect(() => {
        const isIndeterminate =
            selectedPeople.length > 0 &&
            selectedPeople.length < filteredData?.length;
        setChecked(selectedPeople.length === filteredData?.length);
        setIndeterminate(isIndeterminate);

        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedPeople, filteredData]);

    function toggleAll() {
        setSelectedPeople(checked || indeterminate ? [] : filteredData);
        setChecked(checked && indeterminate);
        setIndeterminate(false);
    }

    const [consignment, SetConsignment] = useState();

    const Roles = ["1", "3", "4", "5"];
    const PER_PAGE = 15;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(filteredData?.length / PER_PAGE);
    const tableRef = useRef(null);
    const headers = [
        "ConsignmentNo",
        "Debtor Name",
        "Account Name",
        "Sender Name",
        "Sender Address",
        "Sender Suburb",
        "Sender State",
        "Receiver Name",
        "Receiver Address",
        "Receiver Suburb",
        "Receiver State",
        "Despatch Date",
        "Old Rdd",
        "New Rdd",
        "Reason",
        "Reason Desc",
        "ChangeAt",
        "ChangedBy",
    ];
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Consignments table",
        sheet: "Consignments",
    });
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = selectedPeople.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (columnKey === "Reason") {
                        const Reason = rddReasons?.find(
                            (reason) => reason.ReasonId === person.Reason
                        );
                        acc[columnKey] = Reason?.ReasonName;
                    } else if (column === "Despatch Date") {
                        acc[columnKey] =
                            moment(
                                person["DespatchDate"],
                                "YYYY/MM/DD h:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DespatchDate"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column === "Account Name") {
                        acc[columnKey] = person.AccountNumber;
                    } else if (column === "ChangeAt") {
                        acc[columnKey] =
                            moment(
                                person["ChangeAt"],
                                "YYYY/MM/DD h:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["ChangeAt"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column === "Old Rdd") {
                        acc[columnKey] =
                            moment(
                                person["OldRdd"],
                                "DD/MM/YYYY h:mm:ss A"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["OldRdd"].replace("T", " "),
                                      "DD/MM/YYYY HH:mm:ss A"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column === "New Rdd") {
                        acc[columnKey] =
                            moment(
                                person["NewRdd"],
                                "DD/MM/YYYY h:mm:ss A"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["NewRdd"].replace("T", " "),
                                      "DD/MM/YYYY HH:mm:ss A"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
                    }
                } else {
                    acc[columnKey] = person[columnKey.toUpperCase()];
                }
                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            worksheet.addRow(Object.values(rowData));
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 15); // Set width of each column
        worksheet.columns = columnWidths.map((width, index) => ({
            width,
            key: selectedColumns[index],
        }));

        // Generate the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            // Convert the buffer to a Blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js or alternative method
            saveAs(blob, "RDD-Report.xlsx");
        });
    }

    const handleEditClick = (consignmentrdd) => {
        SetConsignment(consignmentrdd);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };

    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

    const handleMouseEnter = () => {
        if (selectedPeople.length === 0) {
            setHoverMessage("Please select a row");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 2000);
        }
    };

    return (
        <div className=" w-full bg-smooth ">
            <div className="mt-8">
                <div className="w-full relative">
                    <div className=" sm:border-gray-200 text-gray-400 flex flex-col  gap-y-6 gap-x-2  w-full">
                        <div>
                            {/* Start Date Filter */}
                            <div className="flex flex-col lg:flex-row 2xl:justify-between lg:flex-row 2xl:gap-x-2 gap-y-4 gap-x-10 lg:items-center">
                                <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium leading-6  flex-item items-center"
                                >
                                    Date From
                                </label>
                                <div className="sm:mt-0 md:px-4 ">
                                    <input
                                        type="date"
                                        name="from-date"
                                        onKeyDown={(e) => e.preventDefault()}
                                        value={SDate}
                                        min={oldestDate}
                                        max={EDate}
                                        onChange={handleStartDateChange}
                                        id="from-date"
                                        className="flex-item block w-full max-w-lg h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium leading-6 flex-item"
                                >
                                    To
                                </label>

                                <div className="mt-2 flex-item  sm:mt-0 md:px-4">
                                    <input
                                        type="date"
                                        name="to-date"
                                        onKeyDown={(e) => e.preventDefault()}
                                        value={EDate}
                                        min={SDate}
                                        max={latestDate}
                                        onChange={handleEndDateChange}
                                        id="to-date"
                                        className="block w-full max-w-lg h-[36px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div className="w-72 flex-item w-full sm:max-w-xs max-w-lg">
                                    <div className="relative border rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Con. No."
                                            onChange={(e) =>
                                                handleConsignmentChange(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full py-0.5 h-[36px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                                        />
                                    </div>
                                </div>
                                <Popover className="relative object-right flex-item lg:ml-auto">
                                    <button onMouseEnter={handleMouseEnter}>
                                        <Popover.Button
                                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                selectedPeople.length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-gray-800"
                                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                            disabled={
                                                selectedPeople.length === 0
                                            }
                                        >
                                            Export
                                            <ChevronDownIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>
                                    </button>
                                    {isMessageVisible && (
                                        <div className="absolute top-7 left-0 md:-left-14 w-[9rem] right-0 bg-red-200 text-dark text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                                            {hoverMessage}
                                        </div>
                                    )}

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                <div className="p-4">
                                                    <div className="mt-2 flex flex-col">
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ConsignmentNo"
                                                                className="text-dark focus:ring-goldd rounded "
                                                            />{" "}
                                                            Consignment Number
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DebtorName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Debtor Name
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="AccountName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Account Name
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Name
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderAddress"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Address
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderSuburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Suburb
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderState"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender State
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Name
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverAddress"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Address
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverSuburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Suburb
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverState"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver State
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Despatch Date"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Despatch Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Old Rdd"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Old Rdd
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="New Rdd"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            New Rdd
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Reason"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Reason
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReasonDesc"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Reason Desc
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ChangeAt"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Change At
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ChangedBy"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Changed By
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                    <button
                                                        onClick={
                                                            handleDownloadExcel
                                                        }
                                                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                    >
                                                        Export XLS
                                                    </button>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>
                            </div>

                            {/* End Date Filter */}
                            <div className="sm:border-gray-200 text-gray-400  flex flex-col lg:flex-row md:flex-row md:items-center mt-5 hidden">
                                {/* <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium w-auto flex-item items-center mr-10"
                                >
                                </label> */}
                                <div className="w-full">
                                    <Autocomplete
                                        multiple
                                        id="checkboxes-tags-demo"
                                        limitTags={2}
                                        options={uniqueDebtors}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) =>
                                            option.DebtorName
                                        }
                                        renderOption={(
                                            props,
                                            option,
                                            { selected }
                                        ) => (
                                            <li
                                                key={option.DebtorId}
                                                {...props}
                                            >
                                                <Checkbox
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.DebtorName}
                                            </li>
                                        )}
                                        // style={{ width: 400 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Debtors"
                                                placeholder="Debtors"
                                            />
                                        )}
                                        onChange={handleAutocompleteChange}
                                        value={selectedOptions}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root  bg-white ">
                <div className="w-full border rounded-lg overflow-x-auto containerscroll">
                    <div className="inline-block min-w-full  align-middle ">
                        {filteredData ? (
                            <div className="relative">
                                <table
                                    id="details"
                                    className="min-w-full table-fixed divide-y divide-gray-300 "
                                    // ref={tableRef}
                                >
                                    <thead className="h-12">
                                        <tr className="py-2.5">
                                            <th
                                                scope="col"
                                                className="relative px-7 sm:w-12 sm:px-6"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                />
                                            </th>
                                            <th
                                                scope="col"
                                                className="min-w-[8rem] pr-3 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Con No.
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Debtor Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Account Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Address
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Suburb
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Address
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Suburb
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Despatch Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Old Rdd
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                New Rdd
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Reason
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Reason Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                ChangeAt
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                ChangedBy
                                            </th>
                                            {Roles.includes(
                                                currentUser.role_id
                                            ) ? (
                                                <th
                                                    scope="col"
                                                    className="relative py-3.5 pl-3 pr-6 sm:pr-0"
                                                >
                                                    <span className="sr-only">
                                                        Edit
                                                    </span>
                                                </th>
                                            ) : (
                                                <div></div>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300  max-h-80 overflow-y-scroll">
                                        {filteredData.length > 0 ? (
                                            filteredData
                                                .slice(
                                                    OFFSET,
                                                    OFFSET + PER_PAGE
                                                )
                                                .map((consignment, index) => (
                                                    <tr
                                                        key={
                                                            consignment.AuditId
                                                        }
                                                        className={[
                                                            selectedPeople.includes(
                                                                consignment
                                                            )
                                                                ? "bg-gray-50"
                                                                : "cursor-pointer",
                                                            index % 2 === 0
                                                                ? "bg-smooth"
                                                                : "bg-white",
                                                        ].join(" ")}
                                                    >
                                                        <td className="relative px-7 sm:w-12 sm:px-6">
                                                            {selectedPeople.includes(
                                                                consignment
                                                            ) && (
                                                                <div className="absolute inset-y-0 left-0 w-0.5 bg-goldd" />
                                                            )}
                                                            <input
                                                                type="checkbox"
                                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                                value={
                                                                    consignment.Service
                                                                }
                                                                checked={selectedPeople.includes(
                                                                    consignment
                                                                )}
                                                                onChange={(e) =>
                                                                    setSelectedPeople(
                                                                        e.target
                                                                            .checked
                                                                            ? [
                                                                                  ...selectedPeople,
                                                                                  consignment,
                                                                              ]
                                                                            : selectedPeople.filter(
                                                                                  (
                                                                                      p
                                                                                  ) =>
                                                                                      p !==
                                                                                      consignment
                                                                              )
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        {/* <div onClick={() => handleClick(5,person.id)} className=" hover:cursor-pointer "> */}
                                                        <td
                                                            onClick={() =>
                                                                handleClick(
                                                                    consignment.ConsignmentId
                                                                )
                                                            }
                                                            className={classNames(
                                                                "whitespace-nowrap  pr-3 text-sm font-medium",
                                                                selectedPeople.includes(
                                                                    consignment
                                                                )
                                                                    ? "text-indigo-600"
                                                                    : "text-blue-600 underline hover:cursor-pointer"
                                                            )}
                                                        >
                                                            {
                                                                consignment.ConsignmentNo
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.DebtorName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.AccountNumber
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SenderName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SenderAddress
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SenderSuburb
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SenderState
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ReceiverName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ReceiverAddress
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ReceiverSuburb
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ReceiverState
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment[
                                                                "DespatchDate"
                                                            ]?.replace("T", " ")
                                                                ? moment(
                                                                      consignment.DespatchDate,
                                                                      "YYYY/MM/DD h:mm:ss"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : ""}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment[
                                                                "OldRdd"
                                                            ]?.replace("T", " ")
                                                                ? moment(
                                                                      consignment.OldRdd,
                                                                      "DD/MM/YYYY h:mm:ss A"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : ""}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment[
                                                                "NewRdd"
                                                            ]?.replace("T", " ")
                                                                ? moment(
                                                                      consignment.NewRdd,
                                                                      "DD/MM/YYYY h:mm:ss A"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : ""}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                rddReasons?.find(
                                                                    (reason) =>
                                                                        reason.ReasonId ===
                                                                        consignment.Reason
                                                                )?.ReasonName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ReasonDesc
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment[
                                                                "DespatchDate"
                                                            ]?.replace("T", " ")
                                                                ? moment(
                                                                      consignment.ChangeAt,
                                                                      "YYYY/MM/DD h:mm:ss"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : ""}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ChangedBy
                                                            }
                                                        </td>
                                                        {Roles.includes(
                                                            currentUser.role_id
                                                        ) ? (
                                                            <td className="relative whitespace-nowrap py-4 pl-3 sm:pr-4 pr-6 text-left text-sm font-medium">
                                                                <a
                                                                    href="#"
                                                                    className=" text-blue-500 hover:text-blue-900 flex"
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            consignment
                                                                        )
                                                                    }
                                                                >
                                                                    <PencilIcon className="w-5 h-5" />
                                                                    <span className="ml-2">
                                                                        Edit
                                                                    </span>
                                                                    <span className="sr-only">
                                                                        ,{" "}
                                                                        {
                                                                            consignment.name
                                                                        }
                                                                    </span>
                                                                </a>
                                                            </td>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                        {/* </div> */}
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="19">
                                                    <div class=" h-72 flex items-center justify-center mt-5">
                                                        <div class="text-center flex justify-center flex-col">
                                                            <img
                                                                src={notFound}
                                                                alt=""
                                                                className="w-52 h-auto "
                                                            />
                                                            <h1 class="text-3xl font-bold text-gray-900">
                                                                No Data Found
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>This is true</p>
                        )}
                    </div>
                </div>{" "}
                <div className="pt-4 pb-10 text-xs text-gray-400">
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={
                            "flex flex-row justify-center items-center mt-4 w-full"
                        }
                        pageClassName={
                            "mx-2 p-2 rounded-full hover:bg-gray-100"
                        }
                        previousLinkClassName={
                            "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                        }
                        nextLinkClassName={
                            "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200 object-right flex-item"
                        }
                        disabledClassName={"opacity-50 cursor-not-allowed"}
                        activeClassName={"text-blue-500 font-bold"}
                    />
                </div>
            </div>
            <ModalRDD
                url={url}
                isOpen={isModalOpen}
                updateLocalData={updateLocalData}
                handleClose={handleEditClick}
                consignment={consignment}
                rddReasons={rddReasons}
                currentUser={currentUser}
            />
        </div>
    );
}
