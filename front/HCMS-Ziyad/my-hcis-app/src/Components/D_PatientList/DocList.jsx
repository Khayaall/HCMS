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
        <img src={doctor.image} alt={doctor.name} />
      </div>
      <div className="patientlistcard-content">
        <div className="patientlistcard-details">
          <h3 className="patientlistcard-name">{doctor.name}</h3>
          <div className="patientlistcard-info">
            <p>🩺{doctor.specialty}</p>
            <p className="patientlistcard-time">🕒{doctor.experience} years</p>
          </div>
          <p className="patientlistcard-description">
            Doctor: {doctor.specialty}
          </p>
        </div>
        <div className="patientlistcard-actions">
          <button className="patientlistcard-confirm">View</button>
          <p className="patientlistcard-status">
            {getStatus(doctor.date)} • {doctor.timeRange}
          </p>
        </div>
      </div>
    </div>
  );
};

const DoctorList = ({ doctors, formattedDate }) => {
  const [showAll, setShowAll] = useState(false);

  const filteredDoctors = doctors.filter((doctor) => {
    const doctorDate = new Date(doctor.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return doctorDate === formattedDate;
  });

  const visibleDoctors = showAll ? filteredDoctors : filteredDoctors.slice(0, 4);

  return (
    <>
      {visibleDoctors.map((doctor) => (
        <DoctorListCard key={doctor.id} doctor={doctor} />
      ))}
      {filteredDoctors.length > 4 && (
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