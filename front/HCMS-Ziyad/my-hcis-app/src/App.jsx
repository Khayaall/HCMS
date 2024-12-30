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
import P_Booking from "./Pages/P_Appointment/P_Booking";
import Home from "./Pages/Home/Home";
import { useAuth } from "../AuthContext";
import { MergedDataProvider } from "./Components/APIs/AppointmentsWithPatients";
import { DoctorsDataProvider } from "./Components/APIs/getAllDr";
import { PatientDataProvider } from "./Components/APIs/PatientInfo";

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
                <Route path="/appointment" element={<MergedDataProvider><D_Appointment /></MergedDataProvider>} />
                <Route path="/mypatient" element={<MergedDataProvider><D_PatientList /></MergedDataProvider>} />
                <Route path="/settings" element={<D_ProfilePage />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;