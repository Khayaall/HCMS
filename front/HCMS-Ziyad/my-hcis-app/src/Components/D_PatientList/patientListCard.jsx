import React, { useState } from "react";
import "./patientListCard.css";

const PatientListCard = ({ patient }) => {
  const getStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString()
      ? "Today"
      : "Upcoming";
  };

  return (
    <div className="patientlistcard-card">
      <div
        className="patientlistcard-profile-image"
        style={{ backgroundColor: "#FFD700" }}
      >
        <img src={patient.image} alt={patient.name} />
      </div>
      <div className="patientlistcard-content">
        <div className="patientlistcard-details">
          <h3 className="patientlistcard-name">{patient.name}</h3>
          <div className="patientlistcard-info">
            <p>🩺{patient.job}</p>
            <p className="patientlistcard-time">🕒{patient.date}</p>
          </div>
          <p className="patientlistcard-description">
            Disease: {patient.disease}
          </p>
        </div>
        <div className="patientlistcard-actions">
          <button className="patientlistcard-confirm">View</button>
          <p className="patientlistcard-status">
            {getStatus(patient.date)} • {patient.payment}
          </p>
        </div>
      </div>
    </div>
  );
};

const PatientList = ({ patients }) => {
  const [showAll, setShowAll] = useState(false);

  const today = new Date().toDateString();
  const todayPatients = patients.filter(
    (patient) => new Date(patient.date).toDateString() === today
  );

  const visiblePatients = showAll ? todayPatients : todayPatients.slice(0, 4);

  return (
    <>
      {visiblePatients.map((patient) => (
        <PatientListCard key={patient.id} patient={patient} />
      ))}
      {todayPatients.length > 4 && (
        <button
          className="see-more-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "+ See More"}
        </button>
      )}
    </>
  );
};

export default PatientList;
