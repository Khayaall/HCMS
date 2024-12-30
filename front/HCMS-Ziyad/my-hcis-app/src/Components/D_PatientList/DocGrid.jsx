import React from "react";
import "./patientGridCard.css";

const DoctorGridCard = ({ doctor }) => {
  const getStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString() ? "Today" : "Upcoming";
  };

  return (
    <div className="patientGridCard-card">
      <div className="patientGridCard-content">
        <div className="patientGridCard-details">
          <h3 className="patientGridCard-name">{doctor.name}</h3>
          <div className="patientGridCard-info">
            <p>🩺{doctor.specialty}</p>
            <p className="patientGridCard-time">🕒{doctor.experience} years</p>
          </div>
          <p className="patientGridCard-description">
            Doctor: {doctor.specialty}
          </p>
        </div>
      </div>
      <div className="patientGridCard-profile-image" style={{ backgroundColor: "#FFD700" }}>
        <img src={doctor.image} alt={doctor.name} />
      </div>
      <div className="patientGridCard-actions">
        <div><p className="patientGridCard-status">{getStatus(doctor.date)} • {doctor.timeRange}</p></div>
        <div><button className="patientGridCard-confirm">View</button></div>
      </div>
    </div>
  );
};

const DoctorGrid = ({ doctors }) => {
  return (
    <div className="patientGridCard-container">
      {doctors.slice(0, 12).map((doctor) => (
        <DoctorGridCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorGrid;