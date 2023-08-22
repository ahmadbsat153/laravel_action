import Steps from "@/Components/GTAM/Steps";
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const notificationMethods = [
    { id: "Customer", title: "Customer" },
    { id: "Employee", title: "Employee" },
    { id: "Driver", title: "Driver" },
];

export default function CreateUser() {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const previousStep = () => {
        setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <CSSTransition
                        key={1}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div className="relative my-5">
                            <h2>Step 1: Select user type:</h2>
                            <div>
                                <fieldset className="mt-4 my-10">
                                    <div className="space-y-4">
                                        {notificationMethods.map(
                                            (notificationMethod) => (
                                                <div
                                                    key={notificationMethod.id}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        id={
                                                            notificationMethod.id
                                                        }
                                                        name="notification-method"
                                                        type="radio"
                                                        defaultChecked={
                                                            notificationMethod.id ===
                                                            "email"
                                                        }
                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    />
                                                    <label
                                                        htmlFor={
                                                            notificationMethod.id
                                                        }
                                                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                                    >
                                                        {
                                                            notificationMethod.title
                                                        }
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>
                            </div>
                            <button
                                className="absolute right-1 -bottom-12 bg-dark text-white px-5 py-2 rounded"
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        </div>
                    </CSSTransition>
                );
            case 2:
                return (
                    <CSSTransition
                        key={2}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div className="relative my-5">
                            <h2>Step 2: Select user Credentials:</h2>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <button
                                className="absolute right-1 -bottom-12 bg-dark text-white px-5 py-2 rounded"
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        </div>
                    </CSSTransition>
                );
            case 3:
                return (
                    <CSSTransition
                        key={3}
                        classNames="slide"
                        timeout={300}
                        exit={false}
                    >
                        <div>
                            <h2>Step 3: Confirmation</h2>
                            {/* Your Step 3 form fields here */}
                            <button onClick={previousStep}>Previous</button>
                            <button>Submit</button>
                        </div>
                    </CSSTransition>
                );
            default:
                return null;
        }
    };

    return (
        <div className=" h-auto w-9/12 border-2 border-white rounded-xl max-w-full mx-auto mt-32 bg-white shadow-xl">
            <div className="mx-5 my-5">
                <p className="font-bold text-lg my-4">Add New User</p>
                <div className="my-2">
                    <Steps />
                </div>
                <div className=" rounded-lg p-6 max-w-full mx-auto overflow-x-hidden">
                    <TransitionGroup>{renderStep()}</TransitionGroup>
                </div>
            </div>
        </div>
    );
}
