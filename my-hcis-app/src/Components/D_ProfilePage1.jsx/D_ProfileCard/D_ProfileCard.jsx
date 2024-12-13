import React from 'react';
import './D_ProfileCard.css';

const D_ProfileCard = (props) => {
  // Function to generate stars based on rating
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
      <img src={props.img} alt="Profile" className="profile-img" />
      <h3>{props.name}</h3>
      <p>{props.specialty}</p>
      <button className="edit-button">
        <i className="fas fa-pen"></i> Edit Profile
      </button>
      <div className="ratings">
        <p>Ratings: {props.ratings}</p>
        <div className="stars">{generateStars(props.ratings)}</div>
      </div>
      <div className="trust">
        <p>Trust: {props.trust}%</p>
        <div className="trust-bar">
          <div className="trust-bar-fill" style={{ width: `${props.trust}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default D_ProfileCard;