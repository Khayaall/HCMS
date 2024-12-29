import React from "react";
import "./patientGridCard.css";

const PatientGridCard = ({ patient }) => {
  const getStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString() ? "Today" : "Upcoming";
  };

  return (
    <div className="patientGridCard-card">
      <div className="patientGridCard-content">
        <div className="patientGridCard-details">
          <h3 className="patientGridCard-name">{patient.patientName}</h3>
          <div className="patientGridCard-info">
            <p>🩺{patient.job}</p>
            <p className="patientGridCard-time">🕒{patient.date}</p>
          </div>
          <p className="patientGridCard-description">
              Patient: {patient.patient_type}
          </p>
        </div>
      </div>
      <div className="patientGridCard-profile-image" style={{ backgroundColor: "#FFD700" }}>
        <img src={patient.image} alt={patient.patientName} />
      </div>
      <div className="patientGridCard-actions">
        <div><p className="patientGridCard-status">{getStatus(patient.date)} • {patient.payment}</p></div>
        <div><button className="patientGridCard-confirm">View</button></div>
      </div>
    </div>
  );
};

const PatientGrid = ({ patients }) => {
  return (
    <div className="patientGridCard-container">
      {patients.slice(0, 12).map((patient) => (
        <PatientGridCard key={patient.patient_id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientGrid;