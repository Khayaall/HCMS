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
import P_Overview from "./Pages/Overview/P_Overview";
import A_Overview from "./Pages/Overview/A_Overview";
import Sign_in from "./Pages/Sign_in/Sign_in";
import Sign_up from "./Pages/Sign_up/Sign_up";
import D_Appointment from "./Pages/D_Appointment/D_appointment";
import P_appointment from "./Pages/D_Appointment/P_appointment";
import A_appointment from "./Pages/D_Appointment/A-appointment";
import Home from "./Pages/Home/Home";
import { useAuth } from "../AuthContext";
import { MergedDataProvider } from "./Components/D_PatientList/AppointmentsWithPatients";

const App = () => {
  const { isLoggedIn } = useAuth();

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
                  <Route path="/overview" element={<P_Overview />} />
                </Routes>
                <Routes>
                  <Route
                    path="/appointment"
                    element={
                      <MergedDataProvider>
                        <D_Appointment />
                      </MergedDataProvider>
                    }
                  />
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