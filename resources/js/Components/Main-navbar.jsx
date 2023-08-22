import { Fragment, useState } from "react";
import {
    Bars3BottomLeftIcon,
    CogIcon,
    HomeIcon,
    PhotoIcon,
    PlusIcon,
    RectangleStackIcon,
    Squares2X2Icon,
    UserGroupIcon,
    XMarkIcon,
    Bars3Icon,
    BookmarkSquareIcon,
    FireIcon,
    InboxIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import GtrsTabs from "@/Components/GtrsTabs";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
export default function MainNavbar({
    setMobileMenuOpen,
    mobileMenuOpen,
    setActiveIndexGTRS,
    activePage,
    activeIndexGTRS,
    loadingGtrs,
}) {

const names = ["Management System","gtam","gtw","Report System"]


    return (
        <header className="w-full flex flex-1 flex-col overflow-hidden md:ml-20 fixed top-0 z-10 shadow shadow-md  ">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
                <button
                    type="button"
                    className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3BottomLeftIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                    />
                </button>
                <div className="flex items-center lg:gap-x-16 px-4 sm:px-6">
                    <div>
                        <h2 className="text-sm font-bold leading-7 text-gray-700 sm:truncate sm:text-lg sm:tracking-tight">
                            <span className="text-goldd">GOLD </span>TIGER {names[activePage]}
                        </h2>
                    </div>
                </div>
            </div>
        </header>
    );
}
