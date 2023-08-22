import React, { useState } from "react";
import InvoicesMain from "./Component/Invoices/InvoicesMain";
export default function Invoices({
    currentUser,
    activeIndexInv,
    setActiveIndexInv,
    activePage,
}) {
    const [loading, setLoading] = useState(false);
    return (
        <div className="bg-smooth">
            <div className="md:pl-20 pt-16 ">
                <InvoicesMain
                    activePage={activePage}
                    currentUser={currentUser}
                    loading={loading}
                    setLoading={setLoading}
                    activeIndexInv={activeIndexInv}
                    setActiveIndexInv={setActiveIndexInv}
                />
            </div>
        </div>
    );
}
