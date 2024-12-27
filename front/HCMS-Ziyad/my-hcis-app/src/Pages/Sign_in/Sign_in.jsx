import React, { useState } from "react";
import styles from "./signin.module.css";
import Plogin from "../../assets/Plogin.jpeg";
import Dlogin from "../../assets/Dlogin.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Sign_in = () => {
  const [role, setRole] = useState("Doctor"); // Default role
  const [type, setType] = useState(true);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLogin } = useAuth();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit called");
    console.log(role)
    const requestBody = {
      role,
      password,
    };
    if (role === 'doctor') {
      requestBody.d_id = id;
    }
    if (role.toLowerCase() === 'patient') 
    {
      requestBody.email =  email;
    }
    if (role === 'admin')
    {
      requestBody.a_id = id;
    }

    console.log(requestBody);


    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        // Save token, id, and role in local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('role', data.role);

        // Handle successful response
        console.log('Login successful');
        setLogin(true);
        navigate("/overview");
      } else {
        // Handle error response
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        alert(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
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
                role === "admin" ? styles.active : ""
              }`}
              onClick={() => {
                handleRoleChange("admin");
                setType(true);
              }}
            >
              Admin
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.inputBox}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className={styles.flexInput}>
              <input
                type="text"
                placeholder="ID"
                className={styles.inputSmall}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
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
          {!type ? <img src={Plogin} alt="Patient login" /> : <img src={Dlogin} alt="Doctor login" />}
          <div className={styles.overlay}></div>
        </div>
      </div>
    </div>
  );
};

export default Sign_in;