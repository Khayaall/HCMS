import React, { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
import "./D_ProfileCard.css";
import NavBar from "./NavBar";

const D_ProfileCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: props.firstName,
    lastName: props.lastName,
    img: props.img,
    specialty: props.specialty,
    bio: props.bio || "",
    college: props.college || "",
    degree: props.degree || "",
    ratings: props.ratings !== undefined ? props.ratings : 0, // Provide default value
    trust: 0, // Initialize trust to 0
  });

  useEffect(() => {
    // Calculate trust based on average rating
    const calculateTrust = (averageRating) => {
      return Math.min(100, Math.max(0, (averageRating / 5) * 100)); // Ensure trust is between 0 and 100
    };

    setProfile((prevProfile) => ({
      ...prevProfile,
      trust: calculateTrust(props.averageRating),
    }));
  }, [props.averageRating]);

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const generateStars = (rating) => {
    if (typeof rating !== "number" || isNaN(rating)) {
      console.error("Invalid rating value:", rating);
      return null;
    }

    const validRating = Math.max(0, Math.min(5, rating)); // Ensure rating is between 0 and 5
    const fullStars = Math.floor(validRating);
    const halfStar = validRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <i key={`full-${index}`} className="fas fa-star"></i>
          ))}
        {halfStar && <i key="half" className="fas fa-star-half-alt"></i>}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <i key={`empty-${index}`} className="far fa-star"></i>
          ))}
      </>
    );
  };

  return (
    <div className="profile-card">
      <div className="profile-img-wrapper">
        <img src={profile.img} alt="Profile" className="profile-imgg" />
      </div>

      <h3>
        {profile.firstName} {profile.lastName}
      </h3>
      <p>{profile.specialty}</p>
      <button className="edit-button" onClick={() => setIsModalOpen(true)}>
        <i className="fas fa-pen"></i> Edit Profile
      </button>
      <div className="ratings">
        <p>Ratings: {props.averageRating}</p>
        <div className="stars">{generateStars(props.averageRating)}</div>
      </div>
      <div className="trust">
        <p>Trust: {profile.trust}%</p>
        <div className="trust-bar">
          <div
            className="trust-bar-fill"
            style={{ width: `${profile.trust}%` }}
          ></div>
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
