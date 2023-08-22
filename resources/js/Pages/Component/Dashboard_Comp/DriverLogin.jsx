import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { Fragment } from "react";
import notFound from "../../../assets/pictures/NotFound.png"
import ExcelJS from 'exceljs';
import moment from "moment"
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const report = [
    {
        ConsignmentId: 275576,
        ConsignmentNo: "FOR100312",
        SenderName: "INDUSTRIAL STEEL",
        ReceiverName: "R AND A CONCRETING",
        FromState: "QLD",
        ToState: "VIC",
        POD: true,
        MatchTransit: false,
        MatchRdd: false,
    },
    // More people...
];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function DriverLogin({
    DriverData,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    setDriverData,
    url,
    currentUser
}) {
    const [isFetching, setIsFetching] = useState();

    useEffect(() => {
        if (DriverData === null || DriverData === undefined) {
            setIsFetching(true);
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        axios
        .get(`${url}api/GTRS/DriverLogin`, {
            headers: {
                RoleId: currentUser.role_id,
            },
        })
        .then((res) => {
            const x = JSON.stringify(res.data);
            const parsedDataPromise = new Promise(
                (resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                }
            );
    
            parsedDataPromise.then((parsedData) => {
                setDriverData(parsedData);
                setIsFetching(false);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(2);
        setactiveCon(coindex);
    };

    const [report, setReport] = useState(DriverData);

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

    const [filteredData, setFilteredData] = useState(DriverData);
    const [startDateFilter, setStartDateFilter] = useState(""); // state to store the start date filter value
    const [endDateFilter, setEndDateFilter] = useState(todate);

    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setStartDateFilter(value);
        filterData(value, endDateFilter);
    };

    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEndDateFilter(value);
        filterData(startDateFilter, value);
    };
    const filterData = (startDate, endDate) => {
        // Filter the data based on the start and end date filters
        const filtered = report?.filter((item) => {
            const itemDate = new Date(item.DespatchDate); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            return itemDate >= filterStartDate && itemDate <= filterEndDate; // Compare the item date to the filter dates
        });
        setCurrentPage(0)
        setFilteredData(filtered);
    };
    useEffect(() => {
        filterData(startDateFilter, endDateFilter);
        setReport(DriverData);
    }, [DriverData]);
    const pageCount = Math.ceil(report?.length / PER_PAGE);
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedReport, setSelectedReport] = useState([]);

    useLayoutEffect(() => {
        const isIndeterminate =
            selectedReport.length > 0 && selectedReport.length < report?.length;
        setChecked(selectedReport?.length === report?.length);
        setIndeterminate(isIndeterminate);
        checkbox.current.indeterminate = isIndeterminate;
    }, [selectedReport]);

    function toggleAll() {
        setSelectedReport(checked || indeterminate ? [] : report);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    const tableRef = useRef(null);
    const headers = [
        "Name",
        "Device Code",
        "Smart SCAN",
        "Smart SCAN Freight",
        "Smart SCAN Version",
        "Description",
        "Last Active UTC",
        "VLink",
        "Software Version",
        "Device Sim Type",
        "Device Model",
        "Device Makes",
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
                 if (columnKey === "DeviceSimType") {
                    acc[columnKey] = person["MobilityDeviceSimTypes_Description"];
                }else if (columnKey === "SmartSCANVersion") {
                    acc[columnKey] = person["SmartSCANSoftwareVersion"];
                }else if (columnKey === "DeviceModel") {
                    acc[columnKey] = person["MobilityDeviceModels_Description"];
                }else if (columnKey === "LastActiveUTC") {
                    acc[columnKey] = report[
                        "LastActiveUTC"
                    ] == ""?"":moment(
                        person[
                            "LastActiveUTC"
                        ].replace(
                            "T",
                            " "
                        ),
                        "YYYY-MM-DD HH:mm:ss"
                    ).format(
                        "DD-MM-YYYY h:mm A"
                    );
                }else if (columnKey === "DeviceMakes") {
                    acc[columnKey] = person["MobilityDeviceMakes_Description"];
                }else if (columnKey === "VLink") {
                    acc[columnKey] = person["UsedForVLink"];
                }else if (columnKey === "SmartSCANFreight") {
                    acc[columnKey] = person["UsedForSmartSCANFreight"];
                }else if (columnKey === "SmartSCAN") {
                    acc[columnKey] = person["UsedForSmartSCAN"];
                } else {
                    acc[column.replace(/\s+/g, "")] = person[column.replace(/\s+/g, "")];
                }
            } else {
                acc[columnKey] = person[columnKey];
            }
            return acc;
          }, {})
        );
      
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
    
        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet('Sheet1');
    
        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2B540' }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: 'center' };
    
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
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
    
            // Save the file using FileSaver.js or alternative method
            saveAs(blob, 'Driver-Login.xlsx');
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
                            Driver Login
                        </h1>
                    </div>
                    <div className="absolute left-auto right-10 top-9">
                        <Popover className="relative object-right flex-item md:ml-auto">
                                    <button onMouseEnter={handleMouseEnter}>
                                        <Popover.Button
                                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                selectedReport.length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-gray-800"
                                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                            disabled={
                                                selectedReport.length === 0
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
                                        <div className="absolute top-7 -left-14 w-[9rem] right-0 bg-red-200 text-dark text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
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
                                                        value="Name"
                                                        className="text-dark focus:ring-goldd rounded "
                                                    />{" "}
                                                    Name
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Device Code"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Device Code
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Smart SCAN"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Smart SCAN
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Smart SCAN Freight"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Smart SCAN Freight
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Smart SCAN Version"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Smart SCAN Version
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Description"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Description
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Last Active UTC"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Last Active UTC
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="VLink"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    VLink
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Software Version"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Software Version
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Device Sim Type"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Device Sim Type
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Device Model"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Device Model
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Device Makes"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Device Makes
                                                </label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                            <button
                                                onClick={handleDownloadExcel}
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
                                    <thead>
                                        <tr>
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
                                                className="min-w-[8rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Device Code
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Smart SCAN
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Smart SCAN Freight
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Smart SCAN Version
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Last Active UTC
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                VLink
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Software Version
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Device Sim Type
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Device Model
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Device Makes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300 ">
                                        {report?.length > 0 ? (
                                            report
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
                                                                onChange={(e) =>
                                                                    setSelectedReport(
                                                                        e.target
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
                                                            className={classNames(
                                                                "whitespace-nowrap  pr-3 text-sm font-medium",
                                                                selectedReport.includes(
                                                                    report
                                                                )
                                                                    ? "text-indigo-600"
                                                                    : "text-gray-500"
                                                            )}
                                                        >
                                                            {report["Name"]}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "DeviceCode"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {report[
                                                                "UsedForSmartSCAN"
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
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {report[
                                                                "UsedForSmartSCANFreight"
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
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "SmartSCANSoftwareVersion"
                                                                ]
                                                            }
                                                        </td>

                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "Description"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                // report[
                                                                //     "LastActiveUTC"
                                                                // ].replace('T', ' ')
                                                                report[
                                                                    "LastActiveUTC"
                                                                ] === ""?"":
                                                                moment(
                                                                    report[
                                                                        "LastActiveUTC"
                                                                    ].replace(
                                                                        "T",
                                                                        " "
                                                                    ),
                                                                    "YYYY-MM-DD HH:mm:ss"
                                                                ).format(
                                                                    "DD-MM-YYYY h:mm A"
                                                                )
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {report[
                                                                "UsedForVLink"
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
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "SoftwareVersion"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "MobilityDeviceSimTypes_Description"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "MobilityDeviceModels_Description"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                report[
                                                                    "MobilityDeviceMakes_Description"
                                                                ]
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="13">
                                                    <div class=" h-64 flex items-center justify-center mt-10">
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
                            disabledClassName={"opacity-50 cursor-not-allowed"}
                            activeClassName={"text-blue-500 font-bold"}
                        />
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
