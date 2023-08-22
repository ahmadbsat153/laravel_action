// import Sidebar from "./Layout"

import GtamSidebar from "./Component/gtam-sidebar";
import GtamUsers from "./Component/gtam-users";
import Sidebar from "./Layout";
import { useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export default function Gtms(props) {

return (
    <div>
      {/* <Sidebar /> */}
      <div className=" h-screen flex lg:pl-20 pt-16 ">
        <h3>Hello world</h3>
      </div>
    </div>
  );
}
