import { useEffect, useState } from "react";
import Logo from "../../assets/pictures/Logo.png";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { PublicClientApplication } from "@azure/msal-browser";
import { InertiaApp } from "@inertiajs/inertia-react";
const msalConfig = {
    auth: {
        clientId: "05f70999-6ca7-4ee8-ac70-f2d136c50288",
        authority:
            "https://login.microsoftonline.com/647bf8f1-fc82-468e-b769-65fd9dacd442",
        redirectUri: "http://localhost:8000/Main", // replace with your own redirect URI
    },
};

const scopes = ["user.read"]; // replace with the scopes you need

const pca = new PublicClientApplication(msalConfig);

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");

    const handleNextClick = async (e) => {
        e.preventDefault();

        if (email.endsWith("@gtls.com.au")) {
            // try {
            //     // Step 1: Authenticate the user using Microsoft login popup
            //     const loginResponse = await pca.loginPopup({ scopes });
            //     pca.setActiveAccount(loginResponse.account);

            //     // Step 2: Get the access token silently
            //     const tokenResponse = await pca.acquireTokenSilent({ scopes });
            //     console.log("Token Acquired");
            //     console.log(tokenResponse);

            //     // Step 3: Send the access token to your Laravel backend
            //     const headers = {
            //         Authorization: `Bearer ${tokenResponse.accessToken}`,
            //     };
            //     const response = await fetch("/api/user", {
            //         method: "GET",
            //         headers: {
            //             Authorization: `Bearer ${tokenResponse.accessToken}`,
            //         },
            //     });
            //     const response2 = await fetch("/checkAuth");
            //     console.log("Second response", response2);
            //     // Step 4: Check if the user is authenticated in Laravel
            //     // if (response.status === 401) {
            //     //     // User is not authenticated, redirect to login page
            //     //     window.location.href = "/";
            //     // } else {
            //     //     // User is authenticated, redirect to dashboard page
            //     //     console.log('Going to MAIN');
            //     //     window.location.href = "/Main";
            //     // }
            // } catch (error) {
            //     console.log(" !! Error !!");
            //     console.log(error);
            // }
        } else {
            setShowPassword(true);
        }
    };
    useEffect(() => {
        pca.handleRedirectPromise().then(() => {
            // handle redirect response if any
        });
    }, []);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const handleOnChange = (event) => {
        setEmail(event.target.value);
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <div className="bg-black">
            <GuestLayout>
                <Head title="Sign in" />
                <div className="flex flex-col justify-center items-center">
                    <div className=" w-full shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="relative">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className={`${
                                        showPassword
                                            ? "opacity-0 -translate-x-full"
                                            : "opacity-100"
                                    }  top-0 left-0 transition-all duration-500 text-sm font-medium text-white`}
                                >
                                    Email
                                </InputLabel>
                                <a className="text-white" href="/auth/azure">
                                    Login with Microsoft Azure
                                </a>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className={`${
                                        showPassword
                                            ? "opacity-100"
                                            : "opacity-0 translate-x-full"
                                    } absolute top-0 left-0 transition-all duration-500 text-sm font-medium text-white`}
                                >
                                    Password
                                </InputLabel>

                                <div className=" relative">
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={handleOnChange}
                                        className={`${
                                            showPassword
                                                ? "opacity-0 -translate-x-full"
                                                : "opacity-100"
                                        } absolute appearance-none mb-2 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-500`}
                                        placeholder="Email"
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={handleOnChange}
                                        className={`${
                                            showPassword
                                                ? "opacity-100"
                                                : "opacity-0 translate-x-full"
                                        } appearance-none w-full border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-500`}
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className={`${
                                        showPassword ? "hidden" : "block"
                                    } flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    type="button"
                                    onClick={handleNextClick}
                                >
                                    Next
                                </button>
                                <PrimaryButton
                                    disabled={processing}
                                    className={`${
                                        showPassword ? "block" : "hidden"
                                    } flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    type="submit"
                                >
                                    Sign In
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
                {/* <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="block text-sm font-medium text-white"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            autoComplete="username"
                            isFocused={true}
                            onChange={handleOnChange}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="block text-sm font-medium text-white"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            autoComplete="current-password"
                            onChange={handleOnChange}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="mt-4 font-medium text-yellow-600 hover:text-yellow-500 "
                            >
                                Forgot your password ? 
                            </Link>
                        )}
                    </div>

                    

                    <div className="flex flex-col items-center justify-between">
                        

                        <PrimaryButton
                            className=" flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            disabled={processing}
                        >
                            SIGN IN
                        </PrimaryButton>
                    </div>
                </form> */}
            </GuestLayout>
        </div>
    );
}