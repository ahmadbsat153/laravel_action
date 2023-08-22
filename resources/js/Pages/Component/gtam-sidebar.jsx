import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    ShieldCheckIcon,
    SquaresPlusIcon,
    UsersIcon,
    UserIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
// import { HiUser } from "react-icons/hi";

// import Gtam from '../pages/GTAM'

const navigation = [
    { id: 0, name: "Profile", href: "#", icon: UserIcon, current: true },
    { id: 1, name: "Users", href: "#", icon: UsersIcon, current: false },
    { id: 2, name: "User ", href: "#", icon: ShieldCheckIcon, current: false },
    { id: 3, name: "Teams", href: "#", icon: SquaresPlusIcon, current: false },
    { id: 4, name: "Groups", href: "#", icon: UserGroupIcon, current: false },
    // { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function GtamSidebar({ setActiveIndex }) {
    const [sidebarElements, setSidebarElements] = useState(navigation);
    const handleClick = (index) => {
        setActiveIndex(index);
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setSidebarElements(updatedElements);
    };

    return (
        <div className="h-full ">
            {/* Static sidebar for desktop */}
            <div className=" h-full md:inset-y-0 flex md:w-full md:flex-col ">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex min-h-0 flex-1 flex-col bg-gray-200">
                    <div className="flex flex-shrink-0 bg-gray-200 p-4">
                        <a
                            href="#"
                            className="group block w-full flex-shrink-0"
                        >
                            <div className="flex items-center">
                                <div>
                                    <img
                                        className="inline-block h-14 w-14 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3">
                                    <p className="text-lg font-medium text-gray-800">
                                        Tom Cook
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-200">
                                        Programmer
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-200">
                                        Email
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto pt-2 pb-4">
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {sidebarElements.map((item) => (
                                <a
                                    onClick={() => handleClick(item.id)}
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-gray-300 text-gray-900"
                                            : "text-gray-700 hover:bg-gray-500 hover:text-white",
                                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            item.current
                                                ? "text-gray-800"
                                                : "text-gray-700 group-hover:text-gray-300",
                                            "mr-3 flex-shrink-0 h-6 w-6"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
