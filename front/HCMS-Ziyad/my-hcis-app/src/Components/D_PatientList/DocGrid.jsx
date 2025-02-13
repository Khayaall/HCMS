import React from "react";
import { NavLink } from "react-router-dom";
import "./doctorGridCard.css";

const DoctorGridCard = ({ doctor }) => {
  const getStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString()
      ? "Today"
      : "Upcoming";
  };

  return (
    <div className="doctorGridCard-card">
      <div className="doctorGridCard-content">
        <div className="doctorGridCard-details">
          <h3 className="doctorGridCard-name">{`${doctor.f_name} ${doctor.l_name}`}</h3>
          <div className="doctorGridCard-info">
            <p>🩺{doctor.specialty}</p>
            <p className="doctorGridCard-time">🕒{doctor.dob} years</p>
          </div>
          <p className="doctorGridCard-description">
            Doctor: {doctor.specialty}
          </p>
        </div>
      </div>
      <div
        className="doctorGridCard-profile-image"
        style={{ backgroundColor: "#FFD700" }}
      >
        <img src={doctor.image_url} alt={doctor.name} />
      </div>
      <div className="doctorGridCard-actions">
        <div>
          <p className="doctorGridCard-status">
            {getStatus(doctor.date)} • {doctor.account_status}
          </p>
        </div>
        <div>
          <button className="doctorGridCard-confirm">
            <NavLink
              to={`/patient/D_booking/${doctor.doctor_id}`}
              style={{ textDecoration: "none", color: "var(--main-dark)" }}
            >
              View
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
};

const DoctorGrid = ({ doctors }) => {
  return (
    <div className="doctorGridCard-container">
      {doctors.map((doctor) => (
        <DoctorGridCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorGrid;
