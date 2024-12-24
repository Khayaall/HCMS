import React from "react";
import "./Profile_Reviews.css";

const Profile_Reviews = (props) => {
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
    <div className="review-card">
      <div className="review-header">
        <img src={props.img} alt="Profile" className="review-img" />
        <div className="review-info">
          <h4 className="review-name">{props.name}</h4>
          <p className="review-specialty">{props.specialty}</p>
        </div>
        <div className="review-meta">
          <div className="stars">{generateStars(props.ratings)}</div>
          <p className="review-date">{props.date}</p>
        </div>
      </div>
      <p className="review-content">{props.content}</p>
    </div>
  );
};

export default Profile_Reviews;