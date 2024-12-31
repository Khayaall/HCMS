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
// import dr_profile from "../assets/dr_profile.jpg";
import "./bar.css";
import EditProfileModal from "../Components/D_ProfilePage/EditProfileModal";
import { useAuth } from "../../AuthContext";

const Navbar = () => {
  const [barToggle, setBarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage EditProfileModal visibility
  const [isDarkMode, setIsDarkMode] = useState(false); // State to manage dark mode
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [doctor, setDoctor] = useState({
    image_url: "",
    f_name: "",
    l_name: "",
    specialty: "",
  });
  const doctorDetails = {
    img: doctor.image_url,
    firstName: doctor.f_name,
    lastName: doctor.l_name,
    specialty: doctor.specialty,
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();
  const fetchDoctorProfile = async () => {
    if (!token || !id || !role) {
      console.error("No token, id, or role found, please log in");
      setError("No token, id, or role found, please log in");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/doctor/", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctor data");
      }

      const doctorData = await response.json();
      setDoctor(doctorData);
      console.log("Doctor data:", doctorData);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDoctorProfile();
  }, []);

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

  const { f_name, l_name, specialty, image_url } = doctor;

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
          <div
            className="profile-icon"
            onClick={() => setBarToggle(!barToggle)}
          >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <div className="profile-img">
                  <img src={image_url} alt="" />
                </div>
                <div className="profile-txt">
                  <h5>{f_name + " " + l_name}</h5>
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
          profile={doctorDetails} // Pass the profile data
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
