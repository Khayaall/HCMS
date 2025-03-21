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
import Sign_in from "./Pages/Sign_in/Sign_in";
import Sign_up from "./Pages/Sign_up/Sign_up";
import D_Appointment from "./Pages/D_Appointment/d_appointment";
import Home from "./Pages/Home/Home";
import { useAuth } from "../AuthContext";
import { MergedDataProvider } from "./Components/APIs/AppointmentsWithPatients";
import D_patientDetails from "./Pages/D_patientDetails/D_patientDetails";
import P_Booking from "./Pages/P_Appointment/P_Booking";
import { PatientDataProvider } from "./Components/APIs/PatientInfo";
import { DoctorsDataProvider } from "./Components/APIs/getAllDr";
import Patient_Profile from "./Components/P_ProfilePage/Patient_Profile";
import P_myAppointments from "./Pages/P_myAppointments/P_myAppointments";
import { AppointmentsDataProvider } from "./Components/APIs/PAppointments";
import P_Overview from "./Pages/P_Overview/P_Overview";
import DoctorApp from "./Pages/P_doctorAppointment/DoctorApp";

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <div className="app">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/login" element={<Sign_in />} />
            <Route path="/signup" element={<Sign_up />} />
            <Route path="/" element={<Home />} />
          </Routes>
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
                  <Route
                    path="/overview"
                    element={
                      <MergedDataProvider>
                        <D_Overview />
                      </MergedDataProvider>
                    }
                  />
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
                  <Route
                    path="/mypatient"
                    element={
                      <MergedDataProvider>
                        <D_PatientList />
                      </MergedDataProvider>
                    }
                  />
                </Routes>
                <Routes>
                  <Route path="/dProfile" element={<D_ProfilePage />} />
                </Routes>
                <Routes>
                  <Route
                    path="/doctor/patientDetails/:patientId"
                    element={<D_patientDetails />}
                  />
                </Routes>
                <Routes>
                  <Route path="/pOverview" element={<P_Overview />} />
                </Routes>
                <Routes>
                  <Route
                    path="/patientBooking"
                    element={
                      <DoctorsDataProvider>
                        <PatientDataProvider>
                          <P_Booking />
                        </PatientDataProvider>
                      </DoctorsDataProvider>
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/patient/D_booking/:doctorId"
                    element={<DoctorApp />}
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/patientApp"
                    element={
                      <AppointmentsDataProvider>
                        <P_myAppointments />
                      </AppointmentsDataProvider>
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/patientProfile"
                    element={
                      <PatientDataProvider>
                        <Patient_Profile />
                      </PatientDataProvider>
                    }
                  />
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
