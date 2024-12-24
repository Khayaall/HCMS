import React from "react";
import "./patientGridCard.css";
import patients from "./Patients.json";

const PatientGridCard = ({ patient }) => {
  const getStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString() ? "Today" : "Upcoming";
  };

  return (
    <div className="patientGridCard-card">
      <div className="patientGridCard-profile-image" style={{ backgroundColor: "#FFD700" }}>
        <img src={patient.image} alt={patient.name} />
      </div>
      <div className="patientGridCard-content">
        <div className="patientGridCard-details">
          <h3 className="patientGridCard-name">{patient.name}</h3>
          <div className="patientGridCard-info">
            <p>🩺 {patient.job}</p>
            <p className="patientGridCard-time">🕒 {patient.date}</p>
          </div>
          <p className="patientGridCard-description">
            Disease: {patient.disease}
          </p>
        </div>
        <div className="patientGridCard-actions">
          <button className="patientGridCard-confirm">View</button>
          <p className="patientGridCard-status">{getStatus(patient.date)} • {patient.payment}</p>
        </div>
      </div>
    </div>
  );
};

const PatientGrid = () => {
  return (
    <div className="patientGridCard-container">
      {patients.slice(0, 12).map((patient) => (
        <PatientGridCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientGrid;