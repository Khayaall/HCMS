import React, { useState } from "react";
import "./patientListCard.css";

const DoctorListCard = ({ doctor }) => {
  const getStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString() ? "Today" : "Upcoming";
  };

  return (
    <div className="patientlistcard-card">
      <div
        className="patientlistcard-profile-image"
        style={{ backgroundColor: "#FFD700" }}
      >
        <img src={doctor.image_url} alt={`${doctor.f_name} ${doctor.l_name}`} />
      </div>
      <div className="patientlistcard-content">
        <div className="patientlistcard-details">
          <h3 className="patientlistcard-name">{`${doctor.f_name} ${doctor.l_name}`}</h3>
          <div className="patientlistcard-info">
            <p>🩺{doctor.specialty}</p>
            <p className="patientlistcard-time">🕒 {doctor.start_time} - {doctor.end_time} </p>
          </div>
          <p className="patientlistcard-description">
            Doctor: {doctor.specialty}
          </p>
        </div>
        <div className="patientlistcard-actions">
          <button className="patientlistcard-confirm">View</button>
          <p className="patientlistcard-status">
            {doctor.account_status} 
          </p>
        </div>
      </div>
    </div>
  );
};

const DoctorList = ({ doctors }) => {
  const [showAll, setShowAll] = useState(false);

  console.log("Doctors:", doctors);

  const visibleDoctors = showAll ? doctors : doctors.slice(0, 4);

  return (
    <>
      {visibleDoctors.map((doctor) => (
        <DoctorListCard key={doctor.id} doctor={doctor} />
      ))}
      {doctors.length > 4 && (
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

export default DoctorList;