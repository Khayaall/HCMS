import React, { useState, useEffect } from "react";
import EditPatientProfileModal from "../P_ProfilePage/EditPatientProfileModal";
import "../D_ProfilePage/D_ProfileCard.css";
import Navv from "./NAVVV";

const P_ProfileCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: props.firstName,
    lastName: props.lastName,
    img: props.img,
    specialty: props.specialty,
    age: props.age,
    bio: props.bio || "",
    college: props.college || "",
    degree: props.degree || "",
  });

  useEffect(() => {
    // Update profile state when props change
    setProfile((prevProfile) => ({
      ...prevProfile,
      firstName: props.firstName,
      lastName: props.lastName,
      img: props.img,
      specialty: props.specialty,
      age: props.age,
      bio: props.bio || "",
      college: props.college || "",
      degree: props.degree || "",
    }));
  }, [props]);

  const handleSave = (updatedProfile) => {
    setProfile({
      firstName: updatedProfile.f_name,
      lastName: updatedProfile.l_name,
      img: updatedProfile.image,
      specialty: updatedProfile.specialty,
      age: updatedProfile.age,
      bio: updatedProfile.about_me,
      college: updatedProfile.college,
      degree: updatedProfile.degree,
    });
  };

  // Log props and profile to ensure they are being received correctly
  console.log("P_ProfileCard props:", props);
  console.log("P_ProfileCard profile:", profile);

  return (
    <div className="profile-card">
      <div className="profile-img-wrapper">
        <img src={profile.img} alt="Profile" className="profile-imgg" />
      </div>

      <h3>
        {profile.firstName} {profile.lastName}
      </h3>
      <p>{profile.specialty}</p>
      <p>{profile.age}</p>
      <button className="edit-button" onClick={() => setIsModalOpen(true)}>
        <i className="fas fa-pen"></i> Edit Profile
      </button>
      <EditPatientProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onSave={handleSave}
      />
    </div>
  );
};

export default P_ProfileCard;