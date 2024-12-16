import React, { useState } from "react";
import "./D_ProfilePage.css";
import D_ProfileCard from "./D_ProfileCard/D_ProfileCard";
import NavBar from "./D_ProfileNavBar/NavBar";
import ReviewsSection from "./Profile_Reviews/ReviewsSection";
import My_Profile from "./My_Profile/My_Profile";

const D_ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("My Profile");

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>
      <div className="profile-content">
        <div className="profile-card"> 
          <D_ProfileCard 
            img="https://via.placeholder.com/150"
            firstName="Dr."
            lastName="John Doe"
            specialty="Cardiologist"
            ratings="4.5"
            trust={95}
          />
        </div>
        <div className="profile-bar-reviews">
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "My Profile" && <My_Profile />}
          {activeTab === "Reviews" && <ReviewsSection />}
        </div>
      </div>
    </div>
  );
};

export default D_ProfilePage;