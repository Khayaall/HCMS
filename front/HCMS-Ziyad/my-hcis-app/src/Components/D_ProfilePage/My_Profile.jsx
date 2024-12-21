import React from "react";
import "./My_Profile.css";

const My_Profile = () => {
  const profileInfo = {
    aboutMe: "Responsible physician with 9 years of experience maximizing patient wellness and facility profitability. Seeking to deliver healthcare excellence at Mercy Hospital. At CRMC, maintained 5-star healthgrades score for 112 reviews and 85% patient success.",
    specialties: [
      "Clinical & Interventional Cardiologist",
      "Heart Specialist",
      "Cardiac Anaesthesia",
      "Chief Consultant Cardiology",
      "Cardiac Surgeon"
    ],
    designation: "Professor of Cardiac Surgery",
    department: "Cardiology (Heart)",
    professionalExperience: [
      {
        yearRange: "2014-2016",
        institution: "Dhaka Medical College, Dhaka, Bangladesh",
        position: "Heart Specialist"
      }
    ],
    education: [
      {
        yearRange: "2008-2012",
        institution: "Dhaka Medical College, Dhaka, Bangladesh",
        details: "7th Position in third Professional M.B.B.S."
      },
      {
        yearRange: "2008-2012",
        institution: "Dhaka University, Dhaka, Bangladesh",
        details: "Master of Science"
      }
    ]
  };

  return (
    <div className="profile-container">
      <div className="profile-section">
        <h3>About Me</h3>
        <p>{profileInfo.aboutMe}</p>
      </div>
      <div className="profile-section">
        <h3>Specialties</h3>
        <ul>
          {profileInfo.specialties.map((specialty, index) => (
            <li key={index}>{specialty}</li>
          ))}
        </ul>
      </div>
      <div className="profile-section">
        <h3>Designation</h3>
        <p>{profileInfo.designation}</p>
      </div>
      <div className="profile-section">
        <h3>Department</h3>
        <ul className="department-list">
          <li>{profileInfo.department}</li>
        </ul>
      </div>
      <div className="profile-section">
        <h3>Professional Experience</h3>
        <ul>
          {profileInfo.professionalExperience.map((experience, index) => (
            <li key={index}>
              <p>{experience.yearRange}</p>
              <p>{experience.institution}</p>
              <p>{experience.position}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-section">
        <h3>Education</h3>
        <ul>
          {profileInfo.education.map((edu, index) => (
            <li key={index}>
              <p>{edu.yearRange}</p>
              <p>{edu.institution}</p>
              <p>{edu.details}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default My_Profile;