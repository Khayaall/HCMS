import React from "react";

const NavBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav">
      <ul>
        <li className={activeTab === "My Profile" ? "active" : ""} onClick={() => setActiveTab("My Profile")}>My Profile</li>
        <li className={activeTab === "Change Password" ? "active" : ""} onClick={() => setActiveTab("Change Password")}>Change Password</li>
        <li className={activeTab === "Reviews" ? "active" : ""} onClick={() => setActiveTab("Reviews")}>Reviews</li>
      </ul>
    </div>
  );
};

export default NavBar;