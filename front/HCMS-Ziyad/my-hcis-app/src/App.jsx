import React from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Navbar/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import D_ProfilePage from "./Pages/Profile_Page/D_ProfilePage";
import D_PatientList from "./Pages/D_patientList/D_PatientList";
import D_Overview from "./Pages/Overview/D_Overview";
import Sign_in from "./Pages/Sign_in/Sign_in";
import Sign_up from "./Pages/Sign_up/Sign_up";
import D_Appointment from "./Pages/D_Appointment/D_appointment";
import Home from "./Pages/Home/Home";
import { useAuth } from "../AuthContext";
import { MergedDataProvider } from "./Components/APIs/AppointmentsWithPatients";
import D_patientDetails from "./Pages/D_patientDetails/D_patientDetails";
import P_Booking from "./Pages/P_Appointment/P_Booking";
import { PatientDataProvider } from "./Components/APIs/PatientInfo";
import { DoctorsDataProvider } from "./Components/APIs/getAllDr";
import { AppointmentsDataProvider } from "./Components/APIs/PAppointments"; // Correct import
import P_myAppointments from "./Pages/P_myAppointments/P_myAppointments";
import Patient_Profile from "./Components/P_ProfilePage/Patient_Profile"; // Import the MedicalRecord component

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
                  <Route
                    path="/appointment"
                    element={
                      <MergedDataProvider>
                        <D_Appointment />
                      </MergedDataProvider>
                    }
                  />
                  <Route
                    path="/mypatient"
                    element={
                      <MergedDataProvider>
                        <D_PatientList />
                      </MergedDataProvider>
                    }
                  />
                  <Route path="/settings" element={<D_ProfilePage />} />
                  <Route
                    path="/doctor/patientDetails/:patientId"
                    element={<D_patientDetails />}
                  />
                  <Route
                    path="/patientbooking"
                    element={
                      <DoctorsDataProvider>
                        <PatientDataProvider>
                          <P_Booking />
                        </PatientDataProvider>
                      </DoctorsDataProvider>
                    }
                  />
                  <Route
                    path="/patientmyappointments"
                    element={
                      <AppointmentsDataProvider>
                        <P_myAppointments />
                      </AppointmentsDataProvider>
                    }
                  />
                  <Route
                    path="/Patient_Profile"
                    element={<PatientDataProvider><Patient_Profile /></PatientDataProvider>} // Add the new route here
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