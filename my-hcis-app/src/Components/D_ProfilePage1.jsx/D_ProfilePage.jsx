import React, { useState } from "react";
import "./D_ProfilePage.css";
import D_ProfileCard from "./D_ProfileCard/D_ProfileCard";
import Profile_Reviews from "./Profile_Reviews/Profile_Reviews";

const D_ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Reviews");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews = [
    { title: "Great Doctor", content: "Dr. John Doe is very professional and kind.", rating: 5, date: "2023-01-01" },
    { title: "Highly Recommend", content: "I had a great experience with Dr. John Doe.", rating: 4.5, date: "2023-02-15" },
    { title: "Very Satisfied", content: "Dr. John Doe is very knowledgeable.", rating: 4, date: "2023-03-10" },
    { title: "Excellent Service", content: "Dr. John Doe provided excellent service.", rating: 5, date: "2023-04-05" },
    { title: "Friendly and Professional", content: "Dr. John Doe is friendly and professional.", rating: 4.5, date: "2023-05-20" },
    { title: "Friendly and Professional", content: "Dr. John Doe is friendly and professional.", rating: 4.5, date: "2023-05-20" },
    { title: "Friendly and Professional", content: "Dr. John Doe is friendly and professional.", rating: 4.5, date: "2023-05-20" },
    // Add more reviews as needed
  ];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>
      <div className="profile-content">
        <div className="profile-card"> 
          <D_ProfileCard 
            img="https://via.placeholder.com/150"
            name="Dr. John"
            specialty="Cardiologist"
            ratings="4.5"
            stars="⭐⭐⭐⭐⭐"
            trust={95}
          />
        </div>
        <div className="profile-bar-reviews">
          <div className="nav">
            <ul>
              <li className={activeTab === "My Profile" ? "active" : ""} onClick={() => setActiveTab("My Profile")}>My Profile</li>
              <li className={activeTab === "Change Password" ? "active" : ""} onClick={() => setActiveTab("Change Password")}>Change Password</li>
              <li className={activeTab === "Reviews" ? "active" : ""} onClick={() => setActiveTab("Reviews")}>Reviews</li>
            </ul>
          </div>
          {activeTab === "Reviews" && (
            <div className="reviews-section">
              <h4>Reviews</h4>
              <div className="review-cards">
                {displayedReviews.map((review, index) => (
                  <Profile_Reviews
                    key={index}
                    img="https://via.placeholder.com/150"
                    name="Dr. John Doe"
                    specialty="Cardiologist"
                    date={review.date}
                    ratings={review.rating}
                    content={review.content}
                  />
                ))}
              </div>
              {reviews.length > 4 && (
                <button className="see-more-button" onClick={() => setShowAllReviews(!showAllReviews)}>
                  {showAllReviews ? "Show Less" : "+ See More"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default D_ProfilePage;