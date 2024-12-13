import React, { useState } from "react";
import "./D_ProfilePage.css";
import D_ProfileCard from "./D_ProfileCard/D_ProfileCard";
import NavBar from "./NavBar/NavBar";
import ReviewsSection from "./Profile_Reviews/ReviewsSection";
import My_Profile from "./My_Profile/My_Profile";

const D_ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("My Profile");

  //   "aboutMe": "Responsible physician with 9 years of experience maximizing patient wellness and facility profitability. Seeking to deliver healthcare excellence at Mercy Hospital. At CRMC, maintained 5-star healthgrades score for 112 reviews and 85% patient success.",
  //   "specialties": [
  //     "Clinical & Interventional Cardiologist",
  //     "Heart Specialist",
  //     "Cardiac Anaesthesia",
  //     "Chief Consultant Cardiology",
  //     "Cardiac Surgeon"
  //   ],
  //   "designation": "Professor of Cardiac Surgery",
  //   "department": "Cardiology (Heart)",
  //   "professionalExperience": [
  //     {
  //       "yearRange": "2014-2016",
  //       "institution": "Dhaka Medical College, Dhaka, Bangladesh",
  //       "position": "Heart Specialist"
  //     }
  //   ],
  //   "education": [
  //     {
  //       "yearRange": "2008-2012",
  //       "institution": "Dhaka Medical College, Dhaka, Bangladesh",
  //       "details": "7th Position in third Professional M.B.B.S."
  //     },
  //     {
  //       "yearRange": "2008-2012",
  //       "institution": "Dhaka University, Dhaka, Bangladesh",
  //       "details": "Master of Science"
  //     }
  //   ]
  // };

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