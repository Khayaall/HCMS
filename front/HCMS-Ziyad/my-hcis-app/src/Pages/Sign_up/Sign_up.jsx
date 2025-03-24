import React, { useState } from "react";
import "./signup.css"; // Assuming you have a CSS file for styling
import Plogin from "../../assets/Plogin.jpeg";
import { NavLink, useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const Sign_up = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "",
    birthdate: "",
    address: "",
    doctorId: "",
    patientType: "",
    termsAccepted: false,
    doctorSpeciality: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    const {
      email,
      password,
      confirmPassword,
      role,
      firstName,
      lastName,
      doctorId,
      patientType,
      doctorSpeciality,
    } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const requestBody = {
      email,
      password,
      role,
      f_name: firstName,
      l_name: lastName,
    };

    if (role === "doctor") {
      requestBody.d_id = doctorId;
      requestBody.speciality = doctorSpeciality;
    }
    if (role === "patient") {
      requestBody.patient_type = patientType;
    }

    console.log(requestBody);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Sign up successful");
        navigate("/login");
      } else {
        // Handle error response
        const errorText = await response.text();
        console.error("Sign up failed:", errorText);
        alert(`Sign up failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <div className="form-txt">
          <h2>Sign Up</h2>
          <p>Enter details to create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Role
              </option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>
            {formData.role === "patient" && (
              <select
                name="patientType"
                value={formData.patientType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Patient Type
                </option>
                <option value="obstetrics">Obstetrics</option>
                <option value="pediatric">Pediatric</option>
              </select>
            )}
            {(formData.patientType === "obstetrics" ||
              formData.patientType === "cancer" ||
              formData.patientType === "pregnency") && (
              <select
                name="patientType"
                value={formData.patientType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Patient Type
                </option>
                <option value="cancer">Cancer</option>
                <option value="pregnency">Pregnancy</option>
              </select>
            )}

            {formData.role === "doctor" && (
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="Doctor ID"
                required
              />
            )}
            {formData.role === "doctor" && (
              <select
                name="doctorSpeciality"
                value={formData.doctorSpeciality}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Doctor Speciality
                </option>
                <option value="obstetrics">Obstetrics</option>
                <option value="obstetrics">Oncology</option>
                <option value="infant">infant</option>
              </select>
            )}

            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label className="terms">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />{" "}
            By signing up I agree with <a href="#">Terms and conditions</a>
          </label>
          <button
            type="submit"
            onClick={handleSubmit}
            className="sign-up-button"
          >
            Sign Up
          </button>
          <p className="signin-link">
            You have an account already? <NavLink to="/login">Sign in</NavLink>
          </p>
        </form>
      </div>
      <div className="image-container">
        <img src={Plogin} alt="Sign up" />
        <div className="overlay"></div>
      </div>
    </div>
  );
};

export default Sign_up;
