import React, { useState } from "react";
import styles from "./signin.module.css";
import Plogin from "../../assets/Plogin.jpeg";
import Dlogin from "../../assets/Dlogin.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
const API_URL = process.env.VITE_API_URL;

const Sign_in = () => {
  const [role, setRole] = useState("Doctor"); // Default role
  const [type, setType] = useState(true);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };
  console.log("API_URL:", process.env.VITE_API_URL);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit called");
    // console.log(role);

    const requestBody = {
      role,
      password,
    };
    if (role.toLowerCase() === "doctor") {
      requestBody.d_id = id;
    }
    if (role.toLowerCase() === "patient") {
      requestBody.email = email;
    }
    if (role.toLowerCase() === "admin") {
      requestBody.a_id = id;
    }
    if (role.toLowerCase() === "receptionist") {
      requestBody.r_id = id;
    }

    // console.log(requestBody);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        // Save token, id, and role in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        localStorage.setItem("role", data.role);

        // Handle successful response
        console.log("Login successful");
        login(data.role);
        switch (data.role) {
          case "Doctor":
            return navigate("/overview");
          case "Patient":
            return navigate("/pOverview");
          default:
            return null;
        }
      } else {
        // Handle error response
        const errorText = await response.text();
        console.error("Login failed:", errorText);
        alert(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
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
            <button
              className={`${styles.roleButton} ${
                role === "Admin" ? styles.active : ""
              }`}
              onClick={() => {
                handleRoleChange("Admin");
                setType(true);
              }}
            >
              Admin
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {role === "Patient" && (
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.inputBox}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
            <div className={styles.flexInput}>
              {role != "Patient" && (
                <input
                  type="text"
                  placeholder="ID"
                  className={styles.inputSmall}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              )}
              <input
                type="password"
                placeholder="Password"
                className={styles.inputSmall}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {!type ? (
            <img src={Plogin} alt="Patient login" />
          ) : (
            <img src={Dlogin} alt="Doctor login" />
          )}
          <div className={styles.overlay}></div>
        </div>
      </div>
    </div>
  );
};

export default Sign_in;
