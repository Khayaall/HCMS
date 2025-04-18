import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faMoon,
  faCaretDown,
  faGear,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion, faUser } from "@fortawesome/free-regular-svg-icons";
import "./bar.css";
import EditProfileModal from "../Components/D_ProfilePage/EditProfileModal";
import { useAuth } from "../../AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [barToggle, setBarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage EditProfileModal visibility
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const [profile, setProfile] = useState({
    image_url: "",
    f_name: "",
    l_name: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const fetchProfile = async () => {
    if (!token || !id || !role) {
      console.error("No token, id, or role found, please log in");
      setError("No token, id, or role found, please log in");
      setLoading(false);
      return;
    }
    const roleLower = role.toLowerCase();
    try {
      const response = await fetch(`${API_URL}/${roleLower}/`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": roleLower,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${role} datazz`);
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (error) {
      console.error(`Error fetching ${role} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // console.log(role);
  }, [role]);

  const handleSettings = () => {
    switch (role) {
      case "Doctor":
        return (
          <NavLink to="/dProfile">
            <FontAwesomeIcon className="icon" icon={faGear} />
            <p>Settings</p>
          </NavLink>
        );
      case "Patient":
        return (
          <NavLink to="/patientProfile">
            <FontAwesomeIcon className="icon" icon={faGear} />
            <p>Settings</p>
          </NavLink>
        );
      default:
        return null;
    }
  };

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
            <li className="list-line">{handleSettings()}</li>
            <li onClick={handleLogout}>
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

  const { f_name, l_name, specialty, patient_type, image_url } = profile;

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
          <input type="text" placeholder="Search Appointment, Patient ..." />
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
          <div
            className="profile-icon"
            onClick={() => setBarToggle(!barToggle)}
          >
            {loading ? (
              <>
                <p>Loading...</p>
                <FontAwesomeIcon
                  className="icon"
                  icon={faCaretDown}
                  size="lg"
                  style={{ color: "#c7c0bd" }}
                />
              </>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <div className="profile-img">
                  <img src={image_url} alt="Profile" />
                </div>
                <div className="profile-txt">
                  <h5>{f_name + " " + l_name}</h5>
                  <h6>{role === "Doctor" ? specialty : patient_type}</h6>
                </div>
                <p>
                  <FontAwesomeIcon
                    className="icon"
                    icon={faCaretDown}
                    size="lg"
                    style={{ color: "#c7c0bd" }}
                  />
                </p>
              </>
            )}
            {barToggle && <ProfileMenu />}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profile={profile} // Pass the profile data
          onSave={(updatedProfile) => {
            // Handle the save action
            setProfile(updatedProfile);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
