import React, { useState } from "react";
import "./patientListCard.css";
import { NavLink } from "react-router-dom";

const PatientListCard = ({ patient }) => {
  const [hidden, setHidden] = useState(true);
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
        <img src={patient.image} alt={patient.patientName} />
      </div>
      <div className="patientlistcard-content">
        <div className="patientlistcard-details">
          <h3 className="patientlistcard-name">{patient.patientName}</h3>
          <div className="patientlistcard-info">
            <p>🩺{patient.job}</p>
            <p className="patientlistcard-time">🕒{patient.date}</p>
          </div>
          <p className="patientlistcard-description">
            Patient: {patient.patient_type}
          </p>
        </div>
        <div className="patientlistcard-actions">
          <NavLink to={`/doctor/patientDetails/${patient.patient_id}`}>
            <button
              className="patientlistcard-confirm"
              onMouseEnter={() => setHidden(false)}
              onMouseLeave={() => setHidden(true)}
            >
              View
            </button>
          </NavLink>
          <p className="patientlistcard-status">
            {getStatus(patient.date)} • {patient.timeRange}
          </p>
        </div>
      </div>
    </div>
  );
};

const PatientList = ({ patients, formattedDate }) => {
  const [showAll, setShowAll] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const patientDate = new Date(patient.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return patientDate === formattedDate;
  });

  const visiblePatients = showAll
    ? filteredPatients
    : filteredPatients.slice(0, 4);

  return (
    <>
      {visiblePatients.map((patient) => (
        <PatientListCard key={patient.patient_id} patient={patient} />
      ))}
      {filteredPatients.length > 4 && (
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
