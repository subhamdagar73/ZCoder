import React from "react";
import Sidebar from "./components/sidebar";
// importing profile page css
import "./index.css";
function Profilepage() {
  return (
    <div className="container-fluid">
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Sidebar />
        </div>
        </div>
      </div>
  );
}
export default Profilepage;