import { Fragment, useState } from "react";
import { useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import MainSidebar from "../Components/Main-sidebar";
import MainNavbar from "../Components/Main-navbar";
import Gtam from "@/Pages/GTAM";
import Gtms from "@/Pages/GTMS";
import Gtw from "@/Pages/GTW";
import Gtrs from "@/Pages/GTRS";
import NmainSidebar from "@/Components/Nmain-sidebar";
import KPI from "./Component/KPI";
import axios from "axios";
import Support from "./Support";
import Invoices from "./Invoices";

// import AllRoutes from "./RoutesPage";

export default function Sidebar(Boolean) {
    const [currentUser, setcurrentUser] = useState(null);
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                setcurrentUser(res.data);
            })
            .catch((error) => console.log(error));
    }, []);
    useEffect(() => {}, [currentUser]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activePage, setactivePage] = useState();
    const [activeCon, setactiveCon] = useState(0);
    const [loadingGtrs, setLoadingGtrs] = useState(false);
    const [activeIndexGTRS, setActiveIndexGTRS] = useState(0);
    const [activeHeader, setactiveHeader] = useState("null");
    const [currentComponent, setcurrentComponent] = useState([]);
    const [activeIndexInv, setActiveIndexInv] = useState(1);
    const components = [
        <Gtms />,
        <Gtam />,
        <Gtw />,
        <Gtrs
            sessionData={sessionData}
            setactivePage={setactivePage}
            setactiveCon={setactiveCon}
            setMobileMenuOpen={setMobileMenuOpen}
            mobileMenuOpen={mobileMenuOpen}
            activeHeader={activeHeader}
            activeIndexGTRS={activeIndexGTRS}
            setActiveIndexGTRS={setActiveIndexGTRS}
            loadingGtrs={loadingGtrs}
            setLoadingGtrs={setLoadingGtrs}
            currentUser={currentUser}
            setCurrentUser={setcurrentUser}
        />,
        <Invoices
            currentUser={currentUser}
            activeIndexInv={activeIndexInv}
            setActiveIndexInv={setActiveIndexInv}
        />,
    ];

    if (!currentUser) {
        return null; // Render nothing
    } else {
        return (
            <div>
                <div className="bg-smooth h-full ">
                    {/* <NmainSidebar/> */}
                    <MainSidebar
                        setMobileMenuOpen={setMobileMenuOpen}
                        mobileMenuOpen={mobileMenuOpen}
                        activePage={activePage}
                        setactivePage={setactivePage}
                        setActiveIndexGTRS={setActiveIndexGTRS}
                        setActiveIndexInv={setActiveIndexInv}
                        currentUser={currentUser}
                    />
                    <MainNavbar
                        activePage={activePage}
                        setMobileMenuOpen={setMobileMenuOpen}
                        activeIndexGTRS={activeIndexGTRS}
                        mobileMenuOpen={mobileMenuOpen}
                        activeHeader={activeHeader}
                        setActiveIndexGTRS={setActiveIndexGTRS}
                        loadingGtrs={loadingGtrs}
                    />
                    {components[activePage]}
                </div>
            </div>
        );
    }
}
