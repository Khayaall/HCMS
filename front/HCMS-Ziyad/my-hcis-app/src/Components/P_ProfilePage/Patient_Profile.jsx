import React, { useState, useEffect } from "react";
import "./Patient_Profile.css";
import P_ProfileCard from "../../Components/P_ProfilePage/P_ProfileCard"; // Corrected import
import Navv from "../../Components/P_ProfilePage/NAVVV"; // Corrected import
import ChangePassword from "../../Components/D_ProfilePage/ChangePassword";
import MedicalRecord from "../../Components/D_ProfilePage/MedicalRecord"; // Import the MedicalRecord component
import { ReviewsDataProvider } from "../../Components/APIs/RevWithPatients";
const API_URL = import.meta.env.VITE_API_URL;

const Patient_Profile = () => {
  const [activeTab, setActiveTab] = useState("Medical Record");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role").toLowerCase();

        if (!token || !id || !role) {
          console.error("No token, id, or role found, please log in");
          return;
        }

        console.log("Token:", token);
        console.log("ID:", id);
        console.log("Role:", role);

        const response = await fetch(`${API_URL}/patient/`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response Error Text:", errorText);
          throw new Error("An error occurred while fetching patient profile.");
        }

        const data = await response.json();
        setPatientData(data);

        console.log("Patient Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const calculateAge = (dob, specialty) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (specialty === "infant") {
      let months = monthDifference;
      let days = dayDifference;

      if (months < 0) {
        age--;
        months += 12;
      }

      if (days < 0) {
        months--;
        const daysInLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ).getDate();
        days += daysInLastMonth;
      }

      return `${months} M ${days} days`;
    } else if (specialty === "obstetrics") {
      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }
      return `${age} years old`;
    }

    return `${age} years old`;
  };

  return (
    <ReviewsDataProvider>
      <div className="profile-page">
        <div className="profile-header">
          <h2>My Profile</h2>
        </div>
        <div className="profile-content">
          <div className="profile-card">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : patientData ? (
              <P_ProfileCard
                img={patientData.image_url || "https://via.placeholder.com/150"}
                firstName={patientData.f_name}
                lastName={patientData.l_name}
                specialty={patientData.patient_type}
                age={calculateAge(patientData.dob, patientData.patient_type)}
              />
            ) : (
              <p>No patient data available</p>
            )}
          </div>
          <div className="profile-bar-reviews">
            <Navv activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "Medical Record" && (
              <MedicalRecord patientData={patientData} />
            )}{" "}
            {/* Pass patientData as props */}
            {activeTab === "Change Password" && <ChangePassword />}
          </div>
        </div>
      </div>
    </ReviewsDataProvider>
  );
};

export default Patient_Profile;
