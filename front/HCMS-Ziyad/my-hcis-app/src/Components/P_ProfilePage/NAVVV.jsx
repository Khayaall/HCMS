import React from "react";

const Navv = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav">
      <ul> 
        <li className={activeTab === "Medical Record" ? "active" : ""} onClick={() => setActiveTab("Medical Record")}>Medical Record</li> {/* Update this line */}
        <li className={activeTab === "Change Password" ? "active" : ""} onClick={() => setActiveTab("Change Password")}>Change Password</li>
      </ul>
    </div>
  );
};

export default Navv;