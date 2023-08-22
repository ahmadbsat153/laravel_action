import InvoicesButton from "../components/InvoicesButton";
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";

import moment from "moment/moment";
import DropBox from "../components/DropBox";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreatePO({
    PO,
    setPO,
    states,
    AlertToast,
    getPOs,
    setActiveIndexInv,
    supplierData,
    companies,
    url,
    currentUser,
    categories,
}) {
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [isLoading, SetIsLoading] = useState(false);


    useEffect(() => {
        // Filter the data based on userStateId
        let filtered = []
        if(currentUser.role_id == 6 || currentUser.role_id == 7){
            filtered = companies.filter(
                (item) => item.StateId === currentUser.state && item.StatusId == 1
            );
        }else{
            filtered = companies.filter(
                (item) =>  item.StatusId == 1
            );
        }
        
        setFilteredCompanies(filtered);
    }, [companies]);
    useEffect(() => {
        if (!PO) {
            setSelectedCompany(filteredCompanies[0]);
        }
    }, [filteredCompanies]);

    const [stateValue, setStateValue] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existedFiles, setExistedFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [stateField, setstateField] = useState(true);
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
    const [poDate, setPoDate] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    function GoBack() {
        setActiveIndexInv(2);
    }
    useEffect(() => {
        if (PO) {
            setSelectedState(
                states?.find((state) => state.StateId === PO.StateId)
            );
            setSelectedCompany(
                companies?.find((company) => company.CompanyId === PO.CompanyId)
            );
            setSelectedSupplier(
                supplierData?.find(
                    (supplier) => supplier.SupplierId === PO.SupplierId
                )
            );
            setSelectedCategory(
                categories?.find(
                    (category) => category.CategoryId === PO.CategoryId
                )
            );
        }
    }, []);
    useEffect(() => {
        HideShowState();
        if (!PO) {
            setSelectedState(states[0]);
            setSelectedCompany(
                filteredCompanies.filter((item) => item.StatusId == 1)[0]
            );
            setSelectedSupplier(
                supplierData.filter((item) => item.StatusId == 1)[0]
            );
            setSelectedCategory(
                categories.filter((item) => item.StatusId == 1)[0]
            );
            document.getElementById("PoDate").value = "";
            document.getElementById("Amount").value = "";
            document.getElementById("Description").value = "";
            setExistedFiles([]);
            setNewFiles([]);
            setSelectedFiles([]);
        }
    }, [PO]);
    function HideShowState() {
        if (currentUser.role_id == 6 || currentUser.role_id == 7) {
            setstateField(false);
        } else {
            setstateField(true);
        }
    }
    function determineStateValue() {
        if (currentUser.role_id == 6 || currentUser == 7) {
            setStateValue(currentUser.state);
        } else {
            setStateValue(selectedState.StateId);
        }
    }
    useEffect(() => {
        determineStateValue();
    }, [selectedState?.StateId]);

    let filenamesArray = [];

    const handleFileUpload = async () => {
        if (newFiles.length > 0) {
            try {
                const uploadPromises = newFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const response = await axios.post(
                            "/api/uploadPO",
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
                        } else {
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                });

                // Wait for all uploads to complete before proceeding
                await Promise.all(uploadPromises);
                // After all uploads are complete, you can proceed with further actions
                handleCreatePO();
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            handleCreatePO();
            //   alert("Please select one or more files first.");
        }
    };

    const deleteFilesWithStatusTwo = async (fileNamesToDelete) => {
        try {
            const response = await axios.delete("/api/delete-files", {
                data: { fileNames: fileNamesToDelete },
            });
            // Success message from the server
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCreatePO = () => {
        SetIsLoading(true)
        // Get the input values here and update the newobject state
        let approval = 1;
        let secondapproval = 1;
        if (currentUser.role_id == 6) {
            approval = 2;
            secondapproval = 1;
        } else if (currentUser.role_id == 7) {
            approval = 1;
            secondapproval = 1;
        }
        if (PO) {
            approval = PO.ApprovalStatus;
        }
        existedFiles.map((file) => {
            filenamesArray.push({
                DocId: file.DocId,
                DocName: file.DocName,
                DocStatus: file.DocStatus,
            });
        });
        const inputValues = {
            PoId: PO?.PoId,
            StateId: stateValue,
            SupplierId: selectedSupplier.SupplierId,
            CompanyId: selectedCompany.CompanyId,
            CategoryId: selectedCategory.CategoryId,
            PoDate: document.getElementById("PoDate").value,
            Amount: document.getElementById("Amount").value,
            ApprovalStatus: approval,
            SecondApproval: secondapproval,
            PoDoc: filenamesArray,
            Description: document.getElementById("Description").value,
            AddedBy: currentUser.user_id,
        };

        axios
            .post(`${url}api/GTIS/Add/PO`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                getPOs();
                setPO(null);
                AlertToast("Saved Successfully", 1);
                const fileNamesToDelete = existedFiles
                    .filter((file) => file.DocStatus === 2)
                    .map((file) => file.DocName);
                if (fileNamesToDelete.length > 0) {
                    deleteFilesWithStatusTwo(fileNamesToDelete);
                }
                SetIsLoading(false)
            })
            .catch((err) => {
                SetIsLoading(false)
                console.log(err);
                AlertToast("Error please try again.", 2);
            });
    };

    const validateForm = (e) => {
        e.preventDefault()
        if (poDate === "" || description === "" || amount === "") {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };
    const validateEditForm = (e) => {
        e.preventDefault();
        if (
            document.getElementById("PoDate")?.value === "" ||
            document.getElementById("Description")?.value === "" ||
            document.getElementById("Amount")?.value === ""
        ) {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };

    if (PO) {
        return (
            <div className="p-5 flex justify-center bg-smooth">
                <div className="bg-white rounded-xl w-full lg:w-3/6 p-5 shadow">
                <form onSubmit={validateEditForm}>
                    <h1 className="font-bold text-dark text-3xl">Edit PO</h1>
                    <div className="grid grid-cols-2 div p-2 gap-y-2 pb-20 mt-5 text-sm sm:text-base">
                        {stateField == true ? (
                            <h1 className="text-gray-400 border-b">State:</h1>
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
                                                                selectedState?.StateCode
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
                                                                (state) => (
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
                                                                                        state.StateCode
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
                        <h1 className="text-gray-400 border-b">Company:</h1>
                        <div className="border-b pb-2">
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
                                                        {filteredCompanies
                                                            ?.filter(
                                                                (item) =>
                                                                    item.StatusId ==
                                                                    1
                                                            )
                                                            .map((company) => (
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
                                                            ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <h1 className="text-gray-400 border-b">Category:</h1>
                        <div className="border-b pb-2">
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
                                                                (item) =>
                                                                    item.StatusId ==
                                                                    1
                                                            )
                                                            .map((category) => (
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
                                                            ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <h1 className="text-gray-400 border-b">Supplier:</h1>
                        <div className="border-b pb-2">
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
                                                                (item) =>
                                                                    item.StatusId ==
                                                                    1
                                                            )
                                                            .map((supplier) => (
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
                                                            ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <h1 className="text-gray-400 border-b">
                            Date:<span className="text-red-500">*</span>
                        </h1>
                        <div className="border-b pb-2">
                            <input
                                type="date"
                                required
                                name="to-date"
                                id="PoDate"
                                defaultValue={moment(
                                    PO?.PoDate.replace("T", " "),
                                    "YYYY-MM-DD HH:mm:ss"
                                ).format("YYYY-MM-DD")}
                                className="block w-full lg:w-3/6 max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            />
                        </div>
                        <h1 className="text-gray-400 border-b">
                            Description:<span className="text-red-500">*</span>
                        </h1>
                        <div className="border-b pb-2">
                            <input
                                type="text"
                                id="Description"
                                required
                                defaultValue={PO.Description}
                                className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                            />
                        </div>
                        <h1 className="text-gray-400 border-b">
                            Amount:<span className="text-red-500">*</span>
                        </h1>
                        <div className="border-b pb-2">
                            <input
                                type="number"
                                required
                                id="Amount"
                                defaultValue={PO.Amount}
                                className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                            />
                        </div>
                        <h1 className="text-gray-400 border-b">File:</h1>
                        <div className="pb-2 border-b">
                            <DropBox
                                selectedFiles={selectedFiles}
                                setSelectedFiles={setSelectedFiles}
                                existedFiles={existedFiles}
                                setExistedFiles={setExistedFiles}
                                newFiles={newFiles}
                                setNewFiles={setNewFiles}
                                object={PO}
                                path={"POs"}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end w-full gap-x-2">
                        <InvoicesButton
                            name="Cancel"
                            onClick={() => {
                                GoBack();
                            }}
                            icon={<ChevronLeftIcon className="mr-1 h-5" />}
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
                            //     validateEditForm();
                            // }}
                        />
                    </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-5 flex justify-center bg-smooth">
                <div className="bg-white rounded-xl w-full lg:w-3/6 p-5 shadow">
                <form onSubmit={validateForm}>
                    <h1 className="font-bold text-dark text-3xl">Create PO</h1>
                    <div className="grid grid-cols-2 div p-2 gap-y-2 pb-20 mt-5 text-sm sm:text-base">
                        {stateField == true ? (
                            <h1 className="text-gray-400 border-b">State:</h1>
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
                                                                selectedState?.StateCode
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
                                                                (state) => (
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
                                                                                        state.StateCode
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
                        <h1 className="text-gray-400 border-b">Company:</h1>
                        <div className="border-b pb-2">
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
                                                        {filteredCompanies
                                                            ?.filter(
                                                                (item) =>
                                                                    item.StatusId ==
                                                                    1
                                                            )
                                                            .map((company) => (
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
                                                            ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <h1 className="text-gray-400 border-b">Category:</h1>
                        <div className="border-b pb-2">
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
                                                                (item) =>
                                                                    item.StatusId ==
                                                                    1
                                                            )
                                                            .map((category) => (
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
                                                            ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <h1 className="text-gray-400 border-b">Supplier:</h1>
                        <div className="border-b pb-2">
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
                                                                (item) =>
                                                                    item.StatusId ==
                                                                    1
                                                            )
                                                            .map((supplier) => (
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
                                                            ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <h1 className="text-gray-400 border-b">
                            Date:<span className="text-red-500">*</span>
                        </h1>
                        <div className="border-b pb-2">
                            <input
                                type="date"
                                required
                                name="to-date"
                                id="PoDate"
                                onChange={(e) => {
                                    setPoDate(e.target.value);
                                }}
                                className="block w-full lg:w-3/6 max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            />
                        </div>
                        <h1 className="text-gray-400 border-b">
                            Description:<span className="text-red-500">*</span>
                        </h1>
                        <div className="border-b pb-2">
                            <input
                                type="text"
                                required
                                id="Description"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                            />
                        </div>
                        <h1 className="text-gray-400 border-b">
                            Amount:<span className="text-red-500">*</span>
                        </h1>
                        <div className="border-b pb-2">
                            <input
                                type="number"
                                required
                                id="Amount"
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                }}
                                className="rounded w-full h-7  border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                            />
                        </div>
                        <h1 className="text-gray-400 border-b">File:</h1>
                        <div className="pb-2 border-b">
                            <DropBox
                                selectedFiles={selectedFiles}
                                setSelectedFiles={setSelectedFiles}
                                existedFiles={existedFiles}
                                setExistedFiles={setExistedFiles}
                                newFiles={newFiles}
                                setNewFiles={setNewFiles}
                                path={"POs"}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end w-full gap-x-2">
                        <InvoicesButton
                            name="Cancel"
                            onClick={() => {
                                GoBack();
                            }}
                            icon={<ChevronLeftIcon className="mr-1 h-5" />}
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
                    </form>
                </div>
            </div>
        );
    }
}
