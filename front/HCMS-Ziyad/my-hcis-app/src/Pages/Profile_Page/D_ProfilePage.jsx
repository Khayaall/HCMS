import React, { useState, useEffect, useContext } from "react";
import "./D_ProfilePage.css";
import D_ProfileCard from "../../Components/D_ProfilePage/D_ProfileCard";
import NavBar from "../../Components/D_ProfilePage/NavBar";
import ReviewsSection from "../../Components/D_ProfilePage/ReviewsSection";
import My_Profile from "../../Components/D_ProfilePage/My_Profile";
import ChangePassword from "../../Components/D_ProfilePage/ChangePassword";
import {
  ReviewsDataProvider,
  ReviewsDataContext,
} from "../../Components/APIs/RevWithPatients";
const API_URL = import.meta.env.VITE_API_URL;

const D_ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("My Profile");
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role").toLowerCase();
        if (!token || !id || !role) {
          console.error("No token, id, or role found, please log in");
          setError("No token, id, or role found, please log in");
          setLoading(false);
          return;
        }

        // Fetch doctor profile
        const doctorResponse = await fetch(`${API_URL}/doctor`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        if (!doctorResponse.ok) {
          throw new Error(`HTTP error! status: ${doctorResponse.status}`);
        }

        const doctor = await doctorResponse.json();

        // Print fetched data
        console.log("Doctor Data:", doctor);

        // Set doctor data to state
        setDoctorData(doctor);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setError("Error fetching doctor data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  return (
    <ReviewsDataProvider>
      <div className="profile-page">
        {loading ? (
          <h1 className="loading1">Loading...</h1>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className="profile-header">
              <h2>My Profile</h2>
            </div>
            <div className="profile-content">
              <div className="profile-card">
                {doctorData && (
                  <ProfileCardWithRating doctorData={doctorData} />
                )}
              </div>
              <div className="profile-bar-reviews">
                <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab === "My Profile" && <My_Profile />}
                {activeTab === "Reviews" && <ReviewsSection />}
                {activeTab === "Change Password" && <ChangePassword />}
              </div>
            </div>
          </>
        )}
      </div>
    </ReviewsDataProvider>
  );
};

const ProfileCardWithRating = ({ doctorData }) => {
  const { averageRating } = useContext(ReviewsDataContext);

  return (
    <D_ProfileCard
      img={doctorData.image_url || "https://via.placeholder.com/150"}
      firstName={doctorData.f_name}
      lastName={doctorData.l_name}
      specialty={doctorData.specialty}
      ratings={doctorData.ratings}
      trust={doctorData.trust}
      averageRating={averageRating}
    />
  );
};

export default D_ProfilePage;
