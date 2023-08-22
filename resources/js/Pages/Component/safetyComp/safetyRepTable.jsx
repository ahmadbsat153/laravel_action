import React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { PencilIcon } from "@heroicons/react/24/outline";
import notFound from "../../../assets/pictures/NotFound.png";
import ExcelJS from "exceljs";
import moment from "moment";
import { Fragment } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/20/solid";

import SafetyModal from "@/Components/AddsafetyModal";
import { useEffect } from "react";
import DescriptionModal from "@/Components/DescriptionModal";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SafetyRepTable({
    currentPageRep,
    filteredData,
    url,
    currentUser,
    setFilteredData,
    setDataEdited,
    safetyTypes,
    safetyCauses,
}) {
    //lezem ldata li 3am tenba3eat tiji mn Safety page mech mn hon
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpendesc, setIsModalOpendesc] = useState(false);
    const [safetyDesc, setSafetyDesc] = useState();
    const checkbox = useRef();
    const [currentPage, setCurrentPage] = useState(currentPageRep);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedRecords, setselectedRecords] = useState([]);
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedRecords?.length > 0 &&
            selectedRecords?.length < filteredData?.length;
        setChecked(selectedRecords?.length === filteredData?.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRecords]);

    function toggleAll() {
        setselectedRecords(checked || indeterminate ? [] : filteredData);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    const Roles = ["1", "3", "4", "5"];
    const PER_PAGE = 15;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const pageCount = Math.ceil(filteredData?.length / PER_PAGE);
    const tableRef = useRef(null);
    const headers = [
        "Safety Type",
        "Cons No",
        "Main Cause",
        "State",
        "Explanation",
        "Resolution",
        "Reference",
        "Occured At",
        "Added By",
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
        const data = selectedRecords.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (columnKey === "SafetyType") {
                        const Reason = safetyTypes?.find(
                            (reason) =>
                                reason.SafetyTypeId === person.SafetyType
                        );
                        acc[columnKey] = Reason?.SafetyTypeName;
                    } else if (columnKey === "OccuredAt") {
                        acc[columnKey] =
                            moment(
                                person["OccuredAt"],
                                "YYYY/MM/DD h:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["OccuredAt"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (columnKey === "MainCause") {
                        acc[columnKey] = person?.CAUSE;
                    } else if (columnKey === "Reference") {
                        if (person[column] == 1) {
                            acc[columnKey] = "Internal";
                        } else if (person[column] == 2) {
                            acc[columnKey] = "External";
                        } else if (person[column] == 3) {
                            acc[columnKey] = "Type 3";
                        }
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
            saveAs(blob, "Safety-Report.xlsx");
        });
    }

    const getUniqueTypes = () => {
        const uniqueTypes = filteredData.reduce((acc, data) => {
            if (!acc.includes(data.SafetyType)) {
                acc.push(data.SafetyType);
            }
            return acc;
        }, []);
        return uniqueTypes.map((state) => ({ value: state, label: state }));
    };

    const [buttonAction, setbuttonAction] = useState();
    const [modalRepId, setmodalRepId] = useState();
    const [modalSafetyType, setmodalSafetyType] = useState();
    const [modalMainCause, setmodalMainCause] = useState();
    const [modalState, setmodalState] = useState();
    const [modalDebtorId, setmodalDebtorId] = useState();
    const [modalDepar, setmodalDepar] = useState();
    const [modalExpl, setmodalExpl] = useState();
    const [modalResol, setmodalResol] = useState();
    const [modalRefer, setmodalRefer] = useState();
    const [modalOccuredAt, setmodalOccuredAt] = useState();
    const [modaladdedBy, setmodaladdedBy] = useState();
    const [modalConsNo, setmodalConsNo] = useState();
    const handleAddClick = () => {
        setbuttonAction(1); //To define it's a Add Action
        setmodalRepId("");
        setIsModalOpen(!isModalOpen);
    };

    const handleEditClick = (
        reportId,
        safetyType,
        mainCause,
        state,
        expl,
        resol,
        refer,
        occuredAt,
        consNo,
        addedBy
    ) => {
        setbuttonAction(2); //To define it's a Edit Action
        setmodalRepId(reportId);
        setmodalSafetyType(safetyType);
        setmodalMainCause(mainCause);
        setmodalState(state);
        setmodalExpl(expl);
        setmodalResol(resol);
        setmodalRefer(refer);
        setmodalOccuredAt(occuredAt);
        setmodalConsNo(consNo);
        setmodaladdedBy(addedBy);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };

    const handleEditClickdesc = (report) => {
        setSafetyDesc(report);
        const isModalCurrentlyOpen = !isModalOpendesc;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpendesc(isModalCurrentlyOpen);
    };

    const generateUniqueId = () => {
        const timestamp = new Date().getTime();
        const uniqueId = `id_${timestamp}`;
        return uniqueId;
    };
    const updateLocalData = (id, updates) => {
        let itemFound = false;

        const updatedData = filteredData?.map((item) => {
            if (item.ReportId === id) {
                itemFound = true;
                // Update the fields of the matching item
                return { ...item, ...updates };
            }
            return item;
        });

        if (!itemFound) {
            // Create a new item if the provided id was not found
            updatedData?.push({ id: generateUniqueId(), ...updates });
        }
        setFilteredData(updatedData);
        setDataEdited(true);
    };

    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

    const handleMouseEnter = () => {
        if (selectedRecords.length === 0) {
            setHoverMessage("Please select a row");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 2000);
        }
    };

    return (
        <div>
            <div className=" w-full bg-smooth pb-20">
                <div className="mt-3 ">
                    <div className=" object-right flex md:justify-end gap-x-5 flex-item ">
                        <div className="h-full">
                            {Roles.includes(currentUser.role_id) ? (
                                <button
                                    type="button"
                                    onClick={handleAddClick}
                                    className="inline-flex items-center w-[5.5rem] h-[36px] rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Add safety
                                </button>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <Popover className="relative object-right flex-item ">
                            <button onMouseEnter={handleMouseEnter}>
                                <Popover.Button
                                    className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                        selectedRecords.length === 0
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-gray-800"
                                    } px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    disabled={selectedRecords.length === 0}
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
                                                        value="Safety Type"
                                                        className="text-dark focus:ring-goldd rounded "
                                                    />{" "}
                                                    Safety Type
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Con No"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Con No
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Main Cause"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Main Cause
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="State"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    State
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Explanation"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Explanation
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Resolution"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Resolution
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Reference"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Reference
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Occured At"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Occured At
                                                </label>
                                                <label className="">
                                                    <input
                                                        type="checkbox"
                                                        name="column"
                                                        value="Added By"
                                                        className="text-dark rounded focus:ring-goldd"
                                                    />{" "}
                                                    Added By
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
                <div className="mx-auto mt-4 rounded">
                    <div className="pt-2">
                        <div>
                            <div className="flow-root  bg-white ">
                                <div className="w-full border rounded-lg overflow-x-auto containerscroll">
                                    <div className="inline-block min-w-full  align-middle ">
                                        <div className="relative">
                                            {selectedRecords?.length > 0 && (
                                                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12"></div>
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
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={
                                                                    toggleAll
                                                                }
                                                            />
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Safety Type
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Con No.
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Main Cause
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            State
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Explanation
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Resolution
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Reference
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Occured At
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            Added By
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3  text-left text-sm font-semibold text-gray-600"
                                                        >
                                                            <span className="sr-only">
                                                                eye
                                                            </span>
                                                        </th>
                                                        {Roles.includes(
                                                            currentUser.role_id
                                                        ) ? (
                                                            <th
                                                                scope="col"
                                                                className="px-3  text-left text-sm font-semibold text-gray-600"
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
                                                <tbody className="divide-y divide-gray-300 ">
                                                    {filteredData?.length >
                                                    0 ? (
                                                        filteredData
                                                            .slice(
                                                                OFFSET,
                                                                OFFSET +
                                                                    PER_PAGE
                                                            )
                                                            .map(
                                                                (
                                                                    record,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            record[
                                                                                "ReportId"
                                                                            ]
                                                                        }
                                                                        className={[
                                                                            selectedRecords.includes(
                                                                                record
                                                                            )
                                                                                ? "bg-gray-50"
                                                                                : "cursor-pointer",
                                                                            index %
                                                                                2 ===
                                                                            0
                                                                                ? "bg-smooth"
                                                                                : "bg-white",
                                                                        ].join(
                                                                            " "
                                                                        )}
                                                                    >
                                                                        <td className="relative px-7 sm:w-12 sm:px-6">
                                                                            {selectedRecords.includes(
                                                                                record
                                                                            ) && (
                                                                                <div className="absolute inset-y-0 left-0 w-0.5 bg-goldd" />
                                                                            )}
                                                                            <input
                                                                                type="checkbox"
                                                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                                                value={
                                                                                    record[
                                                                                        "ReportId"
                                                                                    ]
                                                                                }
                                                                                checked={selectedRecords.includes(
                                                                                    record
                                                                                )}
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setselectedRecords(
                                                                                        e
                                                                                            .target
                                                                                            .checked
                                                                                            ? [
                                                                                                  ...selectedRecords,
                                                                                                  record,
                                                                                              ]
                                                                                            : selectedRecords.filter(
                                                                                                  (
                                                                                                      p
                                                                                                  ) =>
                                                                                                      p !==
                                                                                                      record
                                                                                              )
                                                                                    )
                                                                                }
                                                                            />
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {safetyTypes?.find(
                                                                                (
                                                                                    type
                                                                                ) =>
                                                                                    type.SafetyTypeId ===
                                                                                    record[
                                                                                        "SafetyType"
                                                                                    ]
                                                                            )
                                                                                ?.SafetyTypeName ||
                                                                                "Unknown Type"}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {
                                                                                record[
                                                                                    "ConsNo"
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {
                                                                                record[
                                                                                    "CAUSE"
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {
                                                                                record[
                                                                                    "State"
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            <div className="w-[10rem] truncate">
                                                                                {
                                                                                    record[
                                                                                        "Explanation"
                                                                                    ]
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            <div className="w-[10rem] truncate">
                                                                                {
                                                                                    record[
                                                                                        "Resolution"
                                                                                    ]
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {record[
                                                                                "Reference"
                                                                            ] ===
                                                                            1
                                                                                ? "Internal"
                                                                                : record[
                                                                                      "Reference"
                                                                                  ] ===
                                                                                  2
                                                                                ? "External"
                                                                                : ""}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {record[
                                                                                "OccuredAt"
                                                                            ]
                                                                                ? moment(
                                                                                      record[
                                                                                          "OccuredAt"
                                                                                      ].replace(
                                                                                          "T",
                                                                                          " "
                                                                                      ),
                                                                                      "YYYY-MM-DD HH:mm:ss"
                                                                                  ).format(
                                                                                      "DD-MM-YYYY h:mm A"
                                                                                  )
                                                                                : null}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            {
                                                                                record[
                                                                                    "AddedBy"
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                                            <div
                                                                                onClick={() =>
                                                                                    handleEditClickdesc(
                                                                                        record
                                                                                    )
                                                                                }
                                                                            >
                                                                                <EyeIcon className="w-5" />
                                                                            </div>
                                                                        </td>
                                                                        {Roles.includes(
                                                                            currentUser.role_id
                                                                        ) ? (
                                                                            <td className="relative whitespace-nowrap py-4 pl-3 sm:pr-4 pr-6 text-left text-sm font-medium">
                                                                                <a
                                                                                    href="#"
                                                                                    onClick={() =>
                                                                                        handleEditClick(
                                                                                            record[
                                                                                                "ReportId"
                                                                                            ],
                                                                                            record[
                                                                                                "SafetyType"
                                                                                            ],
                                                                                            record[
                                                                                                "CAUSE"
                                                                                            ],
                                                                                            record[
                                                                                                "State"
                                                                                            ],
                                                                                            record[
                                                                                                "Explanation"
                                                                                            ],
                                                                                            record[
                                                                                                "Resolution"
                                                                                            ],
                                                                                            record[
                                                                                                "Reference"
                                                                                            ],
                                                                                            record[
                                                                                                "OccuredAt"
                                                                                            ],
                                                                                            record[
                                                                                                "ConsNo"
                                                                                            ],
                                                                                            record[
                                                                                                "AddedBy"
                                                                                            ]
                                                                                        )
                                                                                    }
                                                                                    className=" text-blue-500 hover:text-blue-900 flex"
                                                                                >
                                                                                    <PencilIcon className="w-5 h-5" />
                                                                                    <span className="ml-2">
                                                                                        Edit
                                                                                    </span>
                                                                                    <span className="sr-only">
                                                                                        ,{" "}
                                                                                        reason
                                                                                    </span>
                                                                                </a>
                                                                            </td>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                    </tr>
                                                                )
                                                            )
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="11">
                                                                <div class=" h-72 flex items-center justify-center mt-5">
                                                                    <div class="text-center flex justify-center flex-col">
                                                                        {/* <img
                                                                            src={
                                                                                notFound
                                                                            }
                                                                            alt=""
                                                                            className="w-52 h-auto "
                                                                        /> */}
                                                                        <div class="text-xl font-bold text-gray-900">
                                                                            Congrats!
                                                                        </div>
                                                                        <div class="text-xl font-bold text-gray-900">
                                                                            Nothing
                                                                            to
                                                                            show
                                                                        </div>
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
            </div>
            <DescriptionModal
                isOpen={isModalOpendesc}
                handleClose={handleEditClickdesc}
                safetyDesc={safetyDesc}
                setSafetyDesc={setSafetyDesc}
                safetyTypes={safetyTypes}
            />
            <SafetyModal
                url={url}
                safetyTypes={safetyTypes}
                safetyCauses={safetyCauses}
                isOpen={isModalOpen}
                handleClose={handleEditClick}
                modalConsNo={modalConsNo}
                modaladdedBy={modaladdedBy}
                modalRepId={modalRepId}
                modalSafetyType={modalSafetyType}
                modalMainCause={modalMainCause}
                modalState={modalState}
                modalDepar={modalDepar}
                modalDebtorId={modalDebtorId}
                modalExpl={modalExpl}
                modalResol={modalResol}
                modalRefer={modalRefer}
                modalOccuredAt={modalOccuredAt}
                currentUser={currentUser}
                buttonAction={buttonAction}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}
