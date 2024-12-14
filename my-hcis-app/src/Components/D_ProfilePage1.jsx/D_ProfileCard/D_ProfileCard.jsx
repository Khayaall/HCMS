import React, { useState } from "react";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import "./D_ProfileCard.css";

const D_ProfileCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: props.name,
    img: props.img,
    specialty: props.specialty,
    ratings: props.ratings,
    trust: props.trust,
  });

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars).fill().map((_, index) => <i key={`full-${index}`} className="fas fa-star"></i>)}
        {halfStar && <i key="half" className="fas fa-star-half-alt"></i>}
        {Array(emptyStars).fill().map((_, index) => <i key={`empty-${index}`} className="far fa-star"></i>)}
      </>
    );
  };

  return (
    <div className="profile-card">
      <img src={profile.img} alt="Profile" className="profile-img" />
      <h3>{profile.name}</h3>
      <p>{profile.specialty}</p>
      <button className="edit-button" onClick={() => setIsModalOpen(true)}>
        <i className="fas fa-pen"></i> Edit Profile
      </button>
      <div className="ratings">
        <p>Ratings: {profile.ratings}</p>
        <div className="stars">{generateStars(profile.ratings)}</div>
      </div>
      <div className="trust">
        <p>Trust: {profile.trust}%</p>
        <div className="trust-bar">
          <div className="trust-bar-fill" style={{ width: `${profile.trust}%` }}></div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onSave={handleSave}
      />
    </div>
  );
};

export default D_ProfileCard;