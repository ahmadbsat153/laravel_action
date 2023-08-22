// export default function Gtam () {
//     return <h1>Contact Me</h1>;
//   };

// import Sidebar from "./Layout"
import GtamSidebar from "./Component/gtam-sidebar";
import GtamUsers from "./Component/gtam-users";

import React, { useState } from "react";
import GtamProfile from "./Component/gtam-Profile";
import Sidebar from "./Layout";
import CreateUser from "./Component/GTAM/CreateUser";
// import Layout from "./Layout";

export default function Gtam(props) {
  
  const [activeIndex, setActiveIndex] = useState(0);
  const components = [<GtamProfile />, <GtamUsers activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>, <CreateUser/>];
  return (
    <div className="">
      {/* <Sidebar /> */}
      <div className=" h-screen flex lg:pl-20 pt-16 ">
        {/* Left sidebar & main wrapper */}
        <div className="min-w-0 flex-1 bg-gray-100 xl:flex">
          <div className="bg-gray-300 xl:w-64 flex-shrink-0 w-full">
            <div className="h-full">
              {/* Start left column area */}
              <div className="relative h-full" style={{ minHeight: "12rem" }}>
                <div className="absolute inset-0 rounded-lg bg-gray-300 border-dashed border-gray-200">
                  <GtamSidebar setActiveIndex={setActiveIndex} />
                </div>
              </div>
              {/* End left column area */}
            </div>
          </div>

          <div className="bg-gray-100 lg:min-w-0 lg:flex-1">
            <div className="h-full">
              {/* Start main area*/}
              <div className="relative h-full" style={{ minHeight: "36rem" }}>
                <div className="absolute inset-0 rounded-lg  border-dashed border-gray-200">
                  {components[activeIndex]}
                </div>
              </div>
              {/* End main area */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
