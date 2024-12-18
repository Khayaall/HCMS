import React, { useState } from "react";
import styles from "./signin.module.css";
import Sign_img from "../../assets/Sign_img.png";
import Plogin from "../../assets/Plogin.jpeg";
import Dlogin from "../../assets/Dlogin.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Sign_in = () => {
  const [role, setRole] = useState("Doctor"); // Default role
  const [type, setType] = useState(false);
  const navigate = useNavigate();
  const { setLogin } = useAuth();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLogin(true);
    // Handle form submission logic here
    navigate("/overview");
    console.log("Form submitted");
  };

  return (
    <div className={styles.container}>
      <div className={styles.signContainer}>
        <div className={styles.loginBox}>
          <h2>Welcome to Doctsy!</h2>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.roleButton} ${
                role === "Doctor" ? styles.active : ""
              }`}
              onClick={() => {
                handleRoleChange("Doctor");
                setType(true);
              }}
            >
              Doctor
            </button>
            <button
              className={`${styles.roleButton} ${
                role === "Patient" ? styles.active : ""
              }`}
              onClick={() => {
                handleRoleChange("Patient");
                setType(false);
              }}
            >
              Patient
            </button>
            <button
              className={`${styles.roleButton} ${
                role === "Receptionist" ? styles.active : ""
              }`}
              onClick={() => {
                handleRoleChange("Receptionist");
                setType(true);
              }}
            >
              Receptionist
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.inputBox}
              required
            />
            <div className={styles.flexInput}>
              <input
                type="text"
                placeholder="ID"
                className={styles.inputSmall}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.inputSmall}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          <p className={styles.signupText}>
            Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
          </p>
        </div>
        <div className={styles.img}>
          {!type ? <img src={Plogin} /> : <img src={Dlogin} />}
          <div className={styles.overlay}></div>
        </div>
      </div>
    </div>
  );
};

export default Sign_in;
