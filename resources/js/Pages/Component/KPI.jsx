import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { compareAsc, format } from "date-fns";
import notFound from "../../assets/pictures/NotFound.png";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
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

export default function KPI({
    url,
    userBody,
    currentUser,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    accData,
    EDate,
    setEDate,
    SDate,
    setSDate,
    KPIData,
    setKPIData,
    oldestDate,
    latestDate,
}) {
    // const [KPIData, setKPIData] = useState();

    useEffect(() => {
        if (!KPIData) {
            setIsFetching(true);
            fetchData();
        }
    }, []); // Empty dependency array ensures the effect runs only once

    const fetchData = async () => {
        try {
            axios
                .post(`${url}api/GTRS/KpiReport`, userBody, {
                    headers: {
                        RoleId: currentUser.role_id,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve, reject) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setKPIData(parsedData);
                        setIsFetching(false);
                    });
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(2);
        setactiveCon(coindex);
    };

    const [report, setReport] = useState(KPIData);
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 15;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const current = new Date();
    const todate = `${current.getFullYear()}-${
        current.getMonth() + 1
    }-${current.getDate()}`;

    const [filteredData, setFilteredData] = useState(KPIData);
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
    const filterData = (startDate, endDate, selectedConsignment) => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters
        const filtered = KPIData?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeTo);
            const originalDate = item.DispatchDate;
            const dateObj = new Date(originalDate.slice(0, 10));
            const newdate = format(new Date(dateObj), "yyyy-MM-dd");
            const itemDate = new Date(newdate); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const receiverMatch = selectedConsignment
                ? item.ConsignmentNo.includes(selectedConsignment)
                : true; // Check if item's receiver name matches the selected receiver, or if no receiver is selected (return true to include all items)
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                receiverMatch &&
                chargeToMatch
            ); // Compare the item date to the filter dates
        });
        setCurrentPage(0);
        setFilteredData(filtered);
    };
    useEffect(() => {
        filterData(SDate, EDate, selectedConsignment);
    }, [accData, SDate, KPIData]);

    const pageCount = Math.ceil(filteredData?.length / PER_PAGE);
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedReport, setSelectedReport] = useState([]);
    const [isFetching, setIsFetching] = useState();
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedReport.length > 0 &&
            selectedReport.length < filteredData?.length;
        setChecked(selectedReport.length === filteredData?.length);
        setIndeterminate(isIndeterminate);

        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedReport, filteredData]);
    function toggleAll() {
        setSelectedReport(checked || indeterminate ? [] : filteredData);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    const tableRef = useRef(null);
    const headers = [
        "Consignment No",
        "Sender Name",
        "Receiver Name",
        "From State",
        "To State",
        "Dispatch Date",
        "RDD",
        "Delivery Date",
        "Match Rdd",
        "POD",
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
        const data = selectedReport.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (column.replace(/\s+/g, "") === "DispatchDate") {
                        acc[columnKey] = moment(
                            person["DispatchDate"].replace("T", " "),
                            "YYYY-MM-DD HH:mm:ss"
                        ).format("DD-MM-YYYY")== "Invalid date"
                        ? ""
                        : moment(
                              person[
                                  "DispatchDate"
                              ].replace("T", " "),
                              "YYYY-MM-DD HH:mm:ss"
                          ).format("DD-MM-YYYY");
                    } else if (column.replace(/\s+/g, "") === "MatchRdd") {
                        if(person[columnKey] === 3){
                            acc[columnKey] = "Pending";
                        }else  if(person[columnKey] === 1){
                            acc[columnKey] = "True";
                        }else  if(person[columnKey] === 2){
                            acc[columnKey] = "False";
                        }
                    } else if (column.replace(/\s+/g, "") === "DeliveryDate") {
                        acc[columnKey] = moment(
                            person["DeliveryDate"].replace("T", " "),
                            "YYYY-MM-DD HH:mm:ss"
                        ).format("DD-MM-YYYY")== "Invalid date"
                        ? ""
                        : moment(
                              person[
                                  "DeliveryDate"
                              ].replace("T", " "),
                              "YYYY-MM-DD HH:mm:ss"
                          ).format("DD-MM-YYYY");
                    } else if (column === "RDD") {
                        acc[columnKey] = moment(
                            person["RDD"].replace("T", " "),
                            "YYYY-MM-DD HH:mm:ss"
                        ).format("DD-MM-YYYY")== "Invalid date"
                        ? ""
                        : moment(
                              person[
                                  "RDD"
                              ].replace("T", " "),
                              "YYYY-MM-DD HH:mm:ss"
                          ).format("DD-MM-YYYY");
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
                    }
                } else {
                    acc[column.replace(/\s+/g, "")] =
                        person[column.replace(/\s+/g, "")];
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
            saveAs(blob, "KPI-Report.xlsx");
        });
    }

    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

    const handleMouseEnter = () => {
        if (selectedReport.length === 0) {
            setHoverMessage("Please select a row");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 2000);
        }
    };

    return (
        <div>
            {/* <Sidebar /> */}
            {isFetching && (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            )}
            {!isFetching && (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                KPI Report
                            </h1>
                            <div className="mt-3">
                                <div className="w-full relative">
                                    <div className=" sm:border-gray-200 text-gray-400 flex flex-col justify-between md:flex-row gap-y-4 gap-x-2 md:items-center">
                                        <label
                                            htmlFor="last-name"
                                            className="inline-block text-sm font-medium leading-6  flex-item "
                                        >
                                            Date From
                                        </label>
                                        <div className="sm:mt-0 md:px-4 ">
                                            <input
                                                type="date"
                                                name="from-date"
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                }
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
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                }
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
                                        <Popover className="relative object-right flex-item md:ml-auto">
                                            <button
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <Popover.Button
                                                    className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                        selectedReport.length ===
                                                        0
                                                            ? "bg-gray-300 cursor-not-allowed"
                                                            : "bg-gray-800"
                                                    } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                                    disabled={
                                                        selectedReport.length ===
                                                        0
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
                                                                    Consignment
                                                                    Number
                                                                </label>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="SenderName"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    Sender
                                                                </label>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="ReceiverName"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    Receiver
                                                                </label>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="FromState"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    From
                                                                </label>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="ToState"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    To
                                                                </label>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="DispatchDate"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    Despatch
                                                                    Date
                                                                </label>
                                                                <label className="">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="RDD"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    RDD
                                                                </label>
                                                                <label className="">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="DeliveryDate"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    Delivery
                                                                    Date
                                                                </label>
                                                                <label className="">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="MatchRdd"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    Match RDD
                                                                </label>
                                                                <label className="">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="column"
                                                                        value="POD"
                                                                        className="text-dark rounded focus:ring-goldd"
                                                                    />{" "}
                                                                    POD
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flow-root  bg-white ">
                        <div className="w-full border rounded-lg overflow-x-auto containerscroll">
                            <div className="inline-block min-w-full  align-middle ">
                                <div className="relative">
                                    {selectedReport.length > 0 && (
                                        <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                                            {/* <button
                                            type="button"
                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            Bulk edit
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            Delete all
                                        </button> */}
                                        </div>
                                    )}
                                    <table className="min-w-full table-fixed divide-y divide-gray-300">
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
                                                    Sender
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    Receiver
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    From
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    To
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    Despatch Date
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    RDD
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    Delivery Date
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    Match RDD
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    POD
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-300 ">
                                            {filteredData?.length > 0 ? (
                                                filteredData
                                                    .slice(
                                                        OFFSET,
                                                        OFFSET + PER_PAGE
                                                    )
                                                    .map((report, index) => (
                                                        <tr
                                                            key={
                                                                report[
                                                                    "ConsignmentId"
                                                                ]
                                                            }
                                                            className={[
                                                                selectedReport.includes(
                                                                    report
                                                                )
                                                                    ? "bg-gray-50"
                                                                    : "cursor-pointer",
                                                                index % 2 === 0
                                                                    ? "bg-smooth"
                                                                    : "bg-white",
                                                            ].join(" ")}
                                                        >
                                                            <td className="relative px-7 sm:w-12 sm:px-6">
                                                                {selectedReport.includes(
                                                                    report
                                                                ) && (
                                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-goldd" />
                                                                )}
                                                                <input
                                                                    type="checkbox"
                                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                                    value={
                                                                        report[
                                                                            "ConsignmentId"
                                                                        ]
                                                                    }
                                                                    checked={selectedReport.includes(
                                                                        report
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSelectedReport(
                                                                            e
                                                                                .target
                                                                                .checked
                                                                                ? [
                                                                                      ...selectedReport,
                                                                                      report,
                                                                                  ]
                                                                                : selectedReport.filter(
                                                                                      (
                                                                                          p
                                                                                      ) =>
                                                                                          p !==
                                                                                          report
                                                                                  )
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td
                                                                onClick={() =>
                                                                    handleClick(
                                                                        report[
                                                                            "ConsignmentId"
                                                                        ]
                                                                    )
                                                                }
                                                                className={classNames(
                                                                    "whitespace-nowrap  pr-3 text-sm font-medium",
                                                                    selectedReport.includes(
                                                                        report
                                                                    )
                                                                        ? "text-indigo-600"
                                                                        : "text-blue-600 underline hover:cursor-pointer"
                                                                )}
                                                            >
                                                                {
                                                                    report[
                                                                        "ConsignmentNo"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {
                                                                    report[
                                                                        "SenderName"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {
                                                                    report[
                                                                        "ReceiverName"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {
                                                                    report[
                                                                        "FromState"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {
                                                                    report[
                                                                        "ToState"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {report[
                                                                    "DispatchDate"
                                                                ]
                                                                    ? moment(
                                                                          report[
                                                                              "DispatchDate"
                                                                          ].replace(
                                                                              "T",
                                                                              " "
                                                                          ),
                                                                          "YYYY-MM-DD HH:mm:ss"
                                                                      ).format(
                                                                          "DD-MM-YYYY"
                                                                      )
                                                                    : null}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {report["RDD"]
                                                                    ? moment(
                                                                          report[
                                                                              "RDD"
                                                                          ].replace(
                                                                              "T",
                                                                              " "
                                                                          ),
                                                                          "YYYY-MM-DD HH:mm:ss"
                                                                      ).format(
                                                                          "DD-MM-YYYY"
                                                                      )
                                                                    : null}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {report[
                                                                    "DeliveryDate"
                                                                ]
                                                                    ? moment(
                                                                          report[
                                                                              "DeliveryDate"
                                                                          ].replace(
                                                                              "T",
                                                                              " "
                                                                          ),
                                                                          "YYYY-MM-DD HH:mm:ss"
                                                                      ).format(
                                                                          "DD-MM-YYYY"
                                                                      )
                                                                    : null}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {report[
                                                                    "MatchRdd"
                                                                ] === 1 ? (
                                                                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-0.5 text-sm font-medium">
                                                                        true
                                                                    </span>
                                                                ) : report[
                                                                      "MatchRdd"
                                                                  ] === 2 ? (
                                                                    <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 px-3 py-0.5 text-sm font-medium">
                                                                        false
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center rounded-full bg-gray-200 text-gray-500 px-3 py-0.5 text-sm font-medium">
                                                                        Pending
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                {report[
                                                                    "POD"
                                                                ] ? (
                                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                        true
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                        false
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="13">
                                                        <div class=" h-72 flex items-center justify-center mt-5">
                                                            <div class="text-center flex justify-center flex-col">
                                                                <img
                                                                    src={
                                                                        notFound
                                                                    }
                                                                    alt=""
                                                                    className="w-52 h-auto "
                                                                />
                                                                <h1 class="text-3xl font-bold text-gray-900">
                                                                    No Data
                                                                    Found
                                                                </h1>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="pt-4 pb-10 text-xs text-gray-400">
                                <ReactPaginate
                                    previousLabel={"← Previous"}
                                    nextLabel={"Next →"}
                                    pageCount={pageCount}
                                    onPageChange={handlePageClick}
                                    containerClassName={
                                        "flex justify-center items-center mt-4"
                                    }
                                    pageClassName={
                                        "mx-2 rounded-full hover:bg-gray-100"
                                    }
                                    previousLinkClassName={
                                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                                    }
                                    nextLinkClassName={
                                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                                    }
                                    disabledClassName={
                                        "opacity-50 cursor-not-allowed"
                                    }
                                    activeClassName={"text-blue-500 font-bold"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
