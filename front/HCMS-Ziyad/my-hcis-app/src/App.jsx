import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Navbar/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import D_ProfilePage from "./Pages/Profile_Page/D_ProfilePage";
import D_PatientList from "./Pages/D_patientList/D_PatientList";
import D_Overview from "./Pages/Overview/D_Overview";
// import P_Overview from "./Pages/Overview/P_Overview";
// import A_Overview from "./Pages/Overview/A_Overview";

import Sign_in from "./Pages/Sign_in/Sign_in";
import Sign_up from "./Pages/Sign_up/Sign_up";
import D_Appointment from "./Pages/D_Appointment/D_appointment";
import Home from "./Pages/Home/Home";
import { useAuth } from "../AuthContext";

const App = () => {
  const { isLoggedIn } = useAuth();

  // useEffect(() => {
  //   // Check if the user is logged in by checking local storage or any other method
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  return (
    <Router>
      <div className="app">
        {!isLoggedIn ? (
          <>
            <Routes>
              <Route path="/login" element={<Sign_in />} />
              <Route path="/signup" element={<Sign_up />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </>
        ) : (
          <>
            <div className="container">
              <div className="sidebar-content">
                <Sidebar />
              </div>
              <div className="navbar-content">
                <Navbar />
              </div>
              <div className="data">
                <Routes>
                  <Route path="/overview" element={<D_Overview />} />
                </Routes>
                <Routes>
                  <Route path="/appointment" element={<D_Appointment />} />
                </Routes>
                <Routes>
                  <Route path="/mypatient" element={<D_PatientList />} />
                </Routes>
                <Routes>
                  <Route path="/settings" element={<D_ProfilePage />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
