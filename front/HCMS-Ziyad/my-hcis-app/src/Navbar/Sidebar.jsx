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
import { useAuth } from "../../AuthContext";
import Clinic_logo3 from "../assets/Clinic_logo3.png";

const Sidebar = () => {
  const { role } = useAuth();

  const renderLinks = () => {
    switch (role.toLowerCase()) {
      case "doctor":
        return (
          <>
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
              <NavLink to="/dProfile">
                <p>
                  <FontAwesomeIcon icon={faGear} />
                </p>
                Profile
              </NavLink>
            </li>
          </>
        );
      case "patient":
        return (
          <>
            <li className="links">
              <NavLink to="/overview">
                <p>
                  <FontAwesomeIcon icon={faSlack} />
                </p>
                Overview
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/patientBooking">
                <p>
                  <FontAwesomeIcon icon={faCalendar} />
                </p>
                Booking
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/profile">
                <p>
                  <FontAwesomeIcon icon={faUser} />
                </p>
                My Appointments
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/settings">
                <p>
                  <FontAwesomeIcon icon={faGear} />
                </p>
                Profile
              </NavLink>
            </li>
          </>
        );
      case "admin":
        return (
          <>
            <li className="links">
              <NavLink to="/overview">
                <p>
                  <FontAwesomeIcon icon={faSlack} />
                </p>
                Overview
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/manage-doctors">
                <p>
                  <FontAwesomeIcon icon={faUser} />
                </p>
                Manage Doctors
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/manage-patients">
                <p>
                  <FontAwesomeIcon icon={faUser} />
                </p>
                Manage Patients
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
          </>
        );
      case "receptionist":
        return (
          <>
            <li className="links">
              <NavLink to="/overview">
                <p>
                  <FontAwesomeIcon icon={faSlack} />
                </p>
                Overview
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/appointments">
                <p>
                  <FontAwesomeIcon icon={faCalendar} />
                </p>
                Appointments
              </NavLink>
            </li>
            <li className="links">
              <NavLink to="/patients">
                <p>
                  <FontAwesomeIcon icon={faUser} />
                </p>
                Patients
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <div className="container">
        <div className="logo">
          <div className="logo-img">
            <img src={Clinic_logo3} alt="Clinic Logo" />
          </div>
          <div className="logo-text">
            <h2>Doct.</h2>
          </div>
        </div>
        <div className="sidebar-links">
          <ul className="links-list">{renderLinks()}</ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
