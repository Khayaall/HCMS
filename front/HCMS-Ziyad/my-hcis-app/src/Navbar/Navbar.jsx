import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faMoon,
  faCaretDown,
  faGear,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion, faUser } from "@fortawesome/free-regular-svg-icons";
// import dr_profile from "../assets/dr_profile.jpg";
import "./bar.css";
import EditProfileModal from "../Components/D_ProfilePage/EditProfileModal";
import { data } from "./data";

const Navbar = () => {
  const [user, setUser] = useState(data);
  const [toggle, setToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage EditProfileModal visibility

  const ProfileMenu = () => {
    return (
      <div className="profile-list">
        <div className="containerP">
          <ul>
            <li>
              <NavLink to="#" onClick={() => setIsModalOpen(true)}>
                <FontAwesomeIcon className="icon" icon={faUser} />
                <p>Profile</p>
              </NavLink>
            </li>
            <li className="list-line">
              <NavLink to="/settings">
                <FontAwesomeIcon className="icon" icon={faGear} />
                <p>Settings</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="#">
                <FontAwesomeIcon className="icon" icon={faPowerOff} />
                <p>Logout</p>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setUser(user.filter((profile) => profile.id === 1));
  }, []);

  return (
    <div className="navbar">
      <div className="container">
        <div className="search-bar">
          <p>
            <FontAwesomeIcon
              className="icon"
              icon={faMagnifyingGlass}
              size="lg"
            />
          </p>
          <input type="text" placeholder="Search Appointment, Patinet ..." />
        </div>
        <div className="nav-icons">
          <p>
            <FontAwesomeIcon
              className="icon"
              icon={faCircleQuestion}
              size="lg"
            />
          </p>
          <p>
            <FontAwesomeIcon className="icon" icon={faMoon} size="lg" />
          </p>

          {user.map((users) => {
            const { id, firstName, lastName, specialty, image } = users;
            return (
              <div
                className="profile-icon"
                onClick={() => setToggle(!toggle)}
                key={id}
              >
                <div className="profile-img">
                  <img src={image} alt="" />
                </div>
                <div className="profile-txt">
                  <h5>{firstName + " " + lastName}</h5>
                  <h6>{specialty}</h6>
                </div>
                <p>
                  <FontAwesomeIcon
                    className="icon"
                    icon={faCaretDown}
                    size="lg"
                    style={{ color: "#c7c0bd" }}
                  />
                </p>
                {toggle && <ProfileMenu />}
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profile={user[0]} // Pass the profile data
          onSave={(updatedProfile) => {
            // Handle the save action
            setUser([updatedProfile]);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
