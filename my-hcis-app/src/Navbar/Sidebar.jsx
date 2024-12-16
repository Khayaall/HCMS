import React from "react";
import { NavLink } from "react-router-dom";
import "./bar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faCalendar,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { faSlack } from "@fortawesome/free-brands-svg-icons";

import Clinic_logo3 from "../assets/Clinic_logo3.png";
const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <div className="container">
          <div className="logo">
            <div className="logo-img">
              <img src={Clinic_logo3} />
            </div>
            <div className="logo-text">
              <h2>Doct.</h2>
            </div>
          </div>
          <div className="sidebar-links">
            <ul className="links-list">
              <li className="links">
                <NavLink to="/overview">
                  <p>
                    <FontAwesomeIcon icon={faSlack} />
                  </p>
                  Overview
                </NavLink>
              </li>
              <li className="links">
                <NavLink to="/appointment">
                  <p>
                    <FontAwesomeIcon icon={faCalendar} />
                  </p>
                  Appointment
                </NavLink>
              </li>
              <li className="links">
                <NavLink to="/mypatient">
                  <p>
                    <FontAwesomeIcon icon={faUser} />
                  </p>
                  My Patient
                </NavLink>
              </li>
              <li className="links">
                <NavLink to="/settings">
                  <p>
                    <FontAwesomeIcon icon={faGear} />
                  </p>
                  Settings
                </NavLink>
              </li>
              <li className="links">
                <NavLink to="/">
                  <p>
                    <FontAwesomeIcon icon={faHouse} />
                  </p>
                  Home
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
