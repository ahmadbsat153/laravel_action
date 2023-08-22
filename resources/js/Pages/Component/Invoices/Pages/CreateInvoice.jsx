import InvoicesButton from "../components/InvoicesButton";
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import DropBox from "../components/DropBox";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreateInvoice({
    states,
    supplierData,
    companies,
    url,
    AlertToast,
    setActiveIndexInv,
    categories,
    getInvoices,
    invoice,
    setInvoice,
    currentUser,
}) {
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [isLoading, SetIsLoading] = useState(false);

    useEffect(() => {
        // Filter the data based on userStateId
        let filtered = [];
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            filtered = companies.filter(
                (item) =>
                    item.StateId === currentUser.state && item.StatusId == 1
            );
        } else {
            filtered = companies.filter((item) => item.StatusId == 1);
        }

        setFilteredCompanies(filtered);
    }, [companies]);
    useEffect(() => {
        if (!invoice) {
            setSelectedCompany(filteredCompanies[0]);
        }
    }, [filteredCompanies]);
    const Amount = document.getElementById("Amount")?.value;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedState, setSelectedState] = useState(states[0]);
    const [selectedCompany, setSelectedCompany] = useState(
        filteredCompanies[0]
    );
    const [selectedSupplier, setSelectedSupplier] = useState(
        supplierData.filter((item) => item.StatusId == 1)[0]
    );
    const [selectedCategory, setSelectedCategory] = useState(
        categories.filter((item) => item.StatusId == 1)[0]
    );
    const [approvalStatus, setApprovalStatus] = useState(1);
    const [secondapprovalStatus, setSecondApprovalStatus] = useState(1);
    const [existedFiles, setExistedFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [stateValue, setStateValue] = useState(1);
    const [stateField, setstateField] = useState(true);
    const [paymentField, setpaymentField] = useState();
    const [paymentType, setPaymentType] = useState(2);
    const [paymentStatus, setPaymentStatus] = useState(1);
    const [invoiceAmount, setInvoiceAmount] = useState(Amount);
    const [processedBankValue, setProcessedBankValue] = useState("");
    const [paymentDateValue, setPaymentDateValue] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [description, setDescription] = useState("");
    const handleResetValues = () => {
        setProcessedBankValue("");
        setPaymentDateValue("");
    };
    function determinePaymentStatusValue() {
        const status = event.target.checked;
        if (status) {
            setPaymentStatus(1);
        } else {
            setPaymentStatus(0);
        }
    }
    const deleteFilesWithStatusTwo = async (fileNamesToDelete) => {
        try {
            axios
                .delete("/delete-file", {
                    data: { file_names: fileNamesToDelete }, // Make sure the key matches your API parameter name
                })
                .then((res) => {
                    console.log(res);
                });
            // Success message from the server
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        if (invoice) {
            setPaymentType(invoice.PaymentTypeId);
        }
    }, []);
    function determinePaymentStatus() {
        const value = event.target.value;
        if (value == 1) {
            //if credit card type
            setPaymentType(value); // set the value of the payment Type
            setPaymentStatus(1); // Set the payment status true if the payment is credit card
        } else {
            //if cash type
            setPaymentStatus(0); // Set the payment status true if the payment is Cash
            setPaymentType(value); // set the value of the payment Type
        }
    }
    function HideShowPaymenFields() {
        if (paymentType == 1) {
            setpaymentField(false); //show processed Bank and payment data but hide the paid checkbox
        } else {
            setpaymentField(true); //hide processed Bank and payment data but show the paid checkbox
        }
    }
    function HideShowState() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            setstateField(false); //hide the state field for the state manager and the assistant
        } else {
            setstateField(true); //show the state field for everyone else
        }
    }
    function determineStateValue() {
        if (currentUser.role_id == 6 || currentUser == 7) {
            setStateValue(currentUser.state); // assign the state value of the request with the current user state when SM or assistant
        } else {
            setStateValue(selectedState.StateId); // assign the state value of the request with the selected state in the field
        }
    }
    useEffect(() => {
        HideShowPaymenFields();
    }, [paymentType]);
    useEffect(() => {
        determineStateValue();
    }, [selectedState?.StateId]);
    useEffect(() => {
        HideShowState();
        defineApprovalStatus();
        if (invoice) {
            //if editing an Invoice
            setSelectedState(
                states?.find((state) => state.StateId === invoice.StateId)
            );
            setSelectedCompany(
                companies?.find(
                    (company) => company.CompanyId === invoice.CompanyId
                )
            );
            setSelectedSupplier(
                supplierData?.find(
                    (supplier) => supplier.SupplierId === invoice.SupplierId
                )
            );
            setSelectedCategory(
                categories?.find(
                    (category) => category.CategoryId === invoice.CategoryId
                )
            );
        }
    }, []);
    function defineApprovalStatus() {
        if (currentUser.role_id == 6) {
            setApprovalStatus(2);
            setSecondApprovalStatus(1);
        } else if (currentUser.role_id == 7) {
            setApprovalStatus(1);
            setSecondApprovalStatus(1);
        }
    }
    function handleAmountChange() {}
    useEffect(() => {
        if (!invoice) {
            handleResetValues();
            setSelectedState(states[0]);
            setSelectedCompany(
                companies.filter((item) => item.StatusId == 1)[0]
            );
            setSelectedSupplier(
                supplierData.filter((item) => item.StatusId == 1)[0]
            );
            setSelectedCategory(
                categories.filter((item) => item.StatusId == 1)[0]
            );
            setExistedFiles([]);
            setNewFiles([]);
            setSelectedFiles([]);
            document.getElementById("InvoiceDate").value = "";
            document.getElementById("DueDate").value = "";
            document.getElementById("Amount").value = "";
            document.getElementById("PaymentTypeId").value = 2;
            document.getElementById("InvoiceNo").value = "";
            document.getElementById("Description").value = "";
        }
    }, [invoice]);
    let filenamesArray = [];
    const handleFileUpload = async () => {
        SetIsLoading(true);

        if (newFiles.length > 0) {
            try {
                const uploadPromises = newFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const response = await axios.post(
                            "/api/upload",
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );

                        if (response.status === 200) {
                            const filename = response.data.filename;
                            filenamesArray.push({
                                DocId: null,
                                DocName: filename,
                                DocStatus: 1,
                            });

                            // You can perform any additional actions here for each uploaded file if needed
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        SetIsLoading(false);
                    }
                });

                // Wait for all uploads to complete before proceeding
                await Promise.all(uploadPromises);
                // After all uploads are complete, you can proceed with further actions
                handleCreateInvoice();
            } catch (error) {
                console.error("Error:", error);
                SetIsLoading(false);
            }
        } else {
            handleCreateInvoice();
            //   alert("Please select one or more files first.");
        }
    };
    const handleCreateInvoice = () => {
        defineApprovalStatus();
        existedFiles.map((file) => {
            filenamesArray.push({
                DocId: file.DocId,
                DocName: file.DocName,
                DocStatus: file.DocStatus,
            });
        });
        // Get the input values here and update the newobject state
        let PodRequired = 0;
        let Paid = 0;
        if (document.getElementById("PodRequired")?.value == "on") {
            PodRequired = 1;
        }
        if (document.getElementById("PaymentStatus")?.value == "on") {
            Paid = 1;
        }

        const inputValues = {
            InvoiceId: invoice?.InvoiceId,
            InvoiceNo: document.getElementById("InvoiceNo").value,
            StateId: stateValue,
            SupplierId: selectedSupplier.SupplierId,
            CompanyId: selectedCompany.CompanyId,
            CategoryId: selectedCategory.CategoryId,
            InvoiceDate: document.getElementById("InvoiceDate").value,
            DueDate: document.getElementById("DueDate").value,
            Amount: document.getElementById("Amount").value,
            PaymentTypeId: document.getElementById("PaymentTypeId").value,
            ProcessedBank: document.getElementById("ProcessedBank")?.value,
            PaymentDate: document.getElementById("PaymentDate")?.value,
            SecondApproval: secondapprovalStatus,
            ApprovalStatus: approvalStatus,
            PaymentStatus: paymentStatus,
            PodRequired: PodRequired,
            InvoiceDoc: filenamesArray,
            Description: document.getElementById("Description").value,
            AddedBy: currentUser.user_id,
        };
        axios
            .post(`${url}api/GTIS/Add/Invoice`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                getInvoices();
                setInvoice(null);
                const fileNamesToDelete = existedFiles
                    .filter((file) => file.DocStatus === 2)
                    .map((file) => file.DocName);
                if (fileNamesToDelete.length > 0) {
                    deleteFilesWithStatusTwo(fileNamesToDelete);
                }
                AlertToast("Saved Successfully", 1);
                SetIsLoading(false);
            })
            .catch((err) => {
                SetIsLoading(false);
                AlertToast("Error please try again.", 2);
                console.log(err);
            });
    };
    function GoBack() {
        setActiveIndexInv(1);
    }
    const validateForm = (e) => {
        e.preventDefault();
        if (
            invoiceNo === "" ||
            invoiceDate === "" ||
            dueDate === "" ||
            description === "" ||
            invoiceAmount === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };
    const validateEditForm = (e) => {
        e.preventDefault();
        if (
            document.getElementById("InvoiceNo")?.value === "" ||
            document.getElementById("InvoiceDate")?.value === "" ||
            document.getElementById("DueDate")?.value === "" ||
            document.getElementById("Description")?.value === "" ||
            document.getElementById("Amount")?.value === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };

    if (invoice) {
        return (
            <div className="bg-smooth flex justify-center">
                <div className="w-full lg:w-1/2 p-5 gap-x-5 gap-y-5">
                    <form onSubmit={validateEditForm}>
                        {" "}
                        <div className="rounded-xl shadow bg-white p-5 ">
                            <div className="">
                                <h1 className="font-bold text-dark text-3xl">
                                    Edit Invoice
                                </h1>
                            </div>
                            <div className="grid grid-cols-2 p-2 gap-y-2 mt-5 pb-5 text-sm sm:text-base">
                                <h1 className="text-gray-400 border-b">
                                    Company:
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <div>
                                        <Listbox
                                            value={selectedCompany}
                                            onChange={(e) => {
                                                setSelectedCompany(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedCompany?.CompanyName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {filteredCompanies.map(
                                                                    (
                                                                        company
                                                                    ) => (
                                                                        <Listbox.Option
                                                                            key={
                                                                                company.CompanyId
                                                                            }
                                                                            className={({
                                                                                active,
                                                                            }) =>
                                                                                classNames(
                                                                                    active
                                                                                        ? "bg-indigo-600 text-white"
                                                                                        : "text-gray-900",
                                                                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                )
                                                                            }
                                                                            value={
                                                                                company
                                                                            }
                                                                        >
                                                                            {({
                                                                                selected,
                                                                                active,
                                                                            }) => (
                                                                                <>
                                                                                    <span
                                                                                        className={classNames(
                                                                                            selected
                                                                                                ? "font-semibold"
                                                                                                : "font-normal",
                                                                                            "block truncate"
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            company.CompanyName
                                                                                        }
                                                                                    </span>

                                                                                    {selected ? (
                                                                                        <span
                                                                                            className={classNames(
                                                                                                active
                                                                                                    ? "text-white"
                                                                                                    : "text-indigo-600",
                                                                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                            )}
                                                                                        >
                                                                                            <CheckIcon
                                                                                                className="h-5 w-5"
                                                                                                aria-hidden="true"
                                                                                            />
                                                                                        </span>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    )
                                                                )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                {stateField == true ? (
                                    <h1 className="text-gray-400 border-b">
                                        State:
                                    </h1>
                                ) : null}
                                {stateField == true ? (
                                    <div className="pb-2 border-b">
                                        <div>
                                            <Listbox
                                                value={selectedState}
                                                onChange={(e) => {
                                                    setSelectedState(e);
                                                }}
                                            >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative ">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <span className="block truncate">
                                                                    {
                                                                        selectedState?.StateName
                                                                    }
                                                                </span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronUpDownIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {states?.map(
                                                                        (
                                                                            state
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    state.StateId
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    state
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                state.StateName
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    Supplier:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div>
                                        <Listbox
                                            value={selectedSupplier}
                                            onChange={(e) => {
                                                setSelectedSupplier(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedSupplier?.SupplierName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {supplierData
                                                                    ?.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.StatusId ==
                                                                            1
                                                                    )
                                                                    .map(
                                                                        (
                                                                            supplier
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    supplier.SupplierId
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    supplier
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                supplier.SupplierName
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Category:
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <div>
                                        <Listbox
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedCategory?.CategoryName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {categories
                                                                    ?.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.StatusId ==
                                                                            1
                                                                    )
                                                                    .map(
                                                                        (
                                                                            category
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    category.CategoryId
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    category
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                category.CategoryName
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice #:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        id="InvoiceNo"
                                        defaultValue={invoice.InvoiceNo}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        required
                                        id="InvoiceDate"
                                        defaultValue={moment(
                                            invoice?.InvoiceDate.replace(
                                                "T",
                                                " "
                                            ),
                                            "YYYY-MM-DD HH:mm:ss"
                                        ).format("YYYY-MM-DD")}
                                        name="to-date"
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Due Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        required
                                        name="to-date"
                                        defaultValue={moment(
                                            invoice?.DueDate.replace("T", " "),
                                            "YYYY-MM-DD HH:mm:ss"
                                        ).format("YYYY-MM-DD")}
                                        id="DueDate"
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Description:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        id="Description"
                                        defaultValue={invoice.Description}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Amount:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="number"
                                        required
                                        defaultValue={invoice.Amount}
                                        onChange={handleAmountChange}
                                        id="Amount"
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Payment Type:
                                </h1>
                                <div className="pb-2 border-b ">
                                    <select
                                        id="PaymentTypeId"
                                        onChange={determinePaymentStatus}
                                        defaultValue={invoice.PaymentTypeId}
                                        className="rounded w-full border-gray-200 border-1 f focus:ring focus:ring-goldt"
                                    >
                                        <option value="2">Cash</option>
                                        <option value="1">Credit Card</option>
                                    </select>
                                </div>

                                {paymentField ? (
                                    <h1 className="text-gray-400 border-b hidden">
                                        Paid:
                                    </h1>
                                ) : null}
                                {paymentField ? (
                                    <div className="pb-2 border-b hidden">
                                        <input
                                            type="checkbox"
                                            id="PaymentStatus"
                                            onClick={
                                                determinePaymentStatusValue
                                            }
                                            defaultChecked={
                                                invoice.PaymentStatus
                                            }
                                            className="rounded text-green-500 focus:ring-green-300"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Processed Bank:
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="text"
                                            id="ProcessedBank"
                                            defaultValue={invoice.ProcessedBank}
                                            className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Payment Date:
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="date"
                                            defaultValue={moment(
                                                invoice?.PaymentDate.replace(
                                                    "T",
                                                    " "
                                                ),
                                                "YYYY-MM-DD HH:mm:ss"
                                            ).format("YYYY-MM-DD")}
                                            id="PaymentDate"
                                            name="to-date"
                                            className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    POD Required:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="checkbox"
                                        id="PodRequired"
                                        defaultChecked={invoice.PodRequired}
                                        className="rounded text-green-500 focus:ring-green-300"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    File:
                                </h1>
                                <DropBox
                                    selectedFiles={selectedFiles}
                                    setSelectedFiles={setSelectedFiles}
                                    existedFiles={existedFiles}
                                    setExistedFiles={setExistedFiles}
                                    newFiles={newFiles}
                                    setNewFiles={setNewFiles}
                                    object={invoice}
                                    path={"Invoices"}
                                />
                            </div>
                            <div className="flex justify-end w-full gap-x-2">
                                <InvoicesButton
                                    name="Cancel"
                                    onClick={() => {
                                        GoBack();
                                    }}
                                    icon={
                                        <ChevronLeftIcon className="mr-1 h-5" />
                                    }
                                />
                                <InvoicesButton
                                    type={"submit"}
                                    name={
                                        isLoading ? (
                                            <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                            </div>
                                        ) : (
                                            "Edit"
                                        )
                                    }
                                    disabled={isLoading}
                                    // onClick={() => {
                                    //     ();
                                    // }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-smooth flex justify-center">
                <div className="w-full lg:w-1/2 p-5 gap-x-5 gap-y-5">
                    <form onSubmit={validateForm}>
                        <div className="rounded-xl shadow bg-white p-5 ">
                            <div className="">
                                <h1 className="font-bold text-dark text-3xl">
                                    Create Invoice
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 p-2 gap-y-2  pb-5 mt-5 text-sm sm:text-base">
                                <h1 className="text-gray-400 border-b">
                                    Company:
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <div>
                                        <Listbox
                                            value={selectedCompany}
                                            onChange={(e) => {
                                                setSelectedCompany(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedCompany?.CompanyName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {filteredCompanies.map(
                                                                    (
                                                                        company
                                                                    ) => (
                                                                        <Listbox.Option
                                                                            key={
                                                                                company.CompanyId
                                                                            }
                                                                            className={({
                                                                                active,
                                                                            }) =>
                                                                                classNames(
                                                                                    active
                                                                                        ? "bg-indigo-600 text-white"
                                                                                        : "text-gray-900",
                                                                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                )
                                                                            }
                                                                            value={
                                                                                company
                                                                            }
                                                                        >
                                                                            {({
                                                                                selected,
                                                                                active,
                                                                            }) => (
                                                                                <>
                                                                                    <span
                                                                                        className={classNames(
                                                                                            selected
                                                                                                ? "font-semibold"
                                                                                                : "font-normal",
                                                                                            "block truncate"
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            company.CompanyName
                                                                                        }
                                                                                    </span>

                                                                                    {selected ? (
                                                                                        <span
                                                                                            className={classNames(
                                                                                                active
                                                                                                    ? "text-white"
                                                                                                    : "text-indigo-600",
                                                                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                            )}
                                                                                        >
                                                                                            <CheckIcon
                                                                                                className="h-5 w-5"
                                                                                                aria-hidden="true"
                                                                                            />
                                                                                        </span>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    )
                                                                )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                {stateField == true ? (
                                    <h1 className="text-gray-400 border-b">
                                        State:
                                    </h1>
                                ) : null}
                                {stateField == true ? (
                                    <div className="pb-2 border-b">
                                        <div>
                                            <Listbox
                                                value={selectedState}
                                                onChange={(e) => {
                                                    setSelectedState(e);
                                                }}
                                            >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative ">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <span className="block truncate">
                                                                    {
                                                                        selectedState?.StateName
                                                                    }
                                                                </span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronUpDownIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {states?.map(
                                                                        (
                                                                            state
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    state.StateId
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    state
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                state.StateName
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    Supplier:
                                </h1>
                                <div className="pb-2 border-b">
                                    <div>
                                        <Listbox
                                            value={selectedSupplier}
                                            onChange={(e) => {
                                                setSelectedSupplier(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedSupplier?.SupplierName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {supplierData
                                                                    ?.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.StatusId ==
                                                                            1
                                                                    )
                                                                    .map(
                                                                        (
                                                                            supplier
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    supplier.SupplierId
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    supplier
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                supplier.SupplierName
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Category:
                                </h1>
                                <div className="pb-2 w-full border-b">
                                    <div>
                                        <Listbox
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedCategory?.CategoryName
                                                                }
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon
                                                                    className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {categories
                                                                    ?.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.StatusId ==
                                                                            1
                                                                    )
                                                                    .map(
                                                                        (
                                                                            category
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    category.CategoryId
                                                                                }
                                                                                className={({
                                                                                    active,
                                                                                }) =>
                                                                                    classNames(
                                                                                        active
                                                                                            ? "bg-indigo-600 text-white"
                                                                                            : "text-gray-900",
                                                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    category
                                                                                }
                                                                            >
                                                                                {({
                                                                                    selected,
                                                                                    active,
                                                                                }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={classNames(
                                                                                                selected
                                                                                                    ? "font-semibold"
                                                                                                    : "font-normal",
                                                                                                "block truncate"
                                                                                            )}
                                                                                        >
                                                                                            {
                                                                                                category.CategoryName
                                                                                            }
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active
                                                                                                        ? "text-white"
                                                                                                        : "text-indigo-600",
                                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon
                                                                                                    className="h-5 w-5"
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        )
                                                                    )}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice #:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        id="InvoiceNo"
                                        required
                                        onChange={(e) => {
                                            setInvoiceNo(e.target.value);
                                        }}
                                        defaultValue=""
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Invoice Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        id="InvoiceDate"
                                        required
                                        defaultValue={""}
                                        onChange={(e) => {
                                            setInvoiceDate(e.target.value);
                                        }}
                                        name="to-date"
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Due Date:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="date"
                                        name="to-date"
                                        required
                                        defaultValue={""}
                                        onChange={(e) => {
                                            setDueDate(e.target.value);
                                        }}
                                        id="DueDate"
                                        className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Description:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="text"
                                        required
                                        defaultValue={""}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                        id="Description"
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Amount:
                                    <span className="text-red-500">*</span>
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="number"
                                        required
                                        id="Amount"
                                        onChange={(e) => {
                                            setInvoiceAmount(e.target.value);
                                        }}
                                        className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    Payment Type:
                                </h1>
                                <div className="pb-2 border-b">
                                    <select
                                        id="PaymentTypeId"
                                        defaultChecked={paymentType}
                                        onChange={determinePaymentStatus}
                                        className="rounded w-full border-gray-200 border-1 f focus:ring focus:ring-goldt"
                                    >
                                        <option value="2">Cash</option>
                                        <option value="1">Credit Card</option>
                                    </select>
                                </div>
                                {paymentField ? (
                                    <h1 className="text-gray-400 border-b hidden">
                                        Paid:
                                    </h1>
                                ) : null}
                                {paymentField ? (
                                    <div className="pb-2 border-b hidden">
                                        <input
                                            type="checkbox"
                                            id="PaymentStatus"
                                            onClick={
                                                determinePaymentStatusValue
                                            }
                                            className="rounded text-green-500 focus:ring-green-300"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Processed Bank:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="text"
                                            id="ProcessedBank"
                                            required
                                            defaultValue={processedBankValue}
                                            onChange={(e) => {
                                                setProcessedBankValue(
                                                    e.target.value
                                                );
                                            }}
                                            className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                ) : null}
                                {!paymentField ? (
                                    <h1 className="text-gray-400 border-b">
                                        Payment Date:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                ) : null}
                                {!paymentField ? (
                                    <div className="pb-2 border-b">
                                        <input
                                            type="date"
                                            id="PaymentDate"
                                            required
                                            defaultValue={paymentDateValue}
                                            onChange={(e) => {
                                                setPaymentDateValue(
                                                    e.target.value
                                                );
                                            }}
                                            name="to-date"
                                            className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                ) : null}
                                <h1 className="text-gray-400 border-b">
                                    POD Required:
                                </h1>
                                <div className="pb-2 border-b">
                                    <input
                                        type="checkbox"
                                        id="PodRequired"
                                        defaultValue={""}
                                        className="rounded text-green-500 focus:ring-green-300"
                                    />
                                </div>
                                <h1 className="text-gray-400 border-b">
                                    File:
                                </h1>
                                <div className="pb-2 border-b">
                                    <DropBox
                                        selectedFiles={selectedFiles}
                                        setSelectedFiles={setSelectedFiles}
                                        existedFiles={existedFiles}
                                        setExistedFiles={setExistedFiles}
                                        path={"Invoices"}
                                        newFiles={newFiles}
                                        setNewFiles={setNewFiles}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end w-full gap-x-2">
                                <InvoicesButton
                                    name="Cancel"
                                    onClick={() => {
                                        GoBack();
                                    }}
                                    icon={
                                        <ChevronLeftIcon className="mr-1 h-5" />
                                    }
                                />
                                <InvoicesButton
                                    type={"submit"}
                                    name={
                                        isLoading ? (
                                            <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                            </div>
                                        ) : (
                                            "Add"
                                        )
                                    }
                                    disabled={isLoading}
                                    // onClick={() => {
                                    //     validateEditForm();
                                    // }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
