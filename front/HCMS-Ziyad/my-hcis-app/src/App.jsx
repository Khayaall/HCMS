import React from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Navbar/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import D_ProfilePage from "./Pages/Profile_Page/D_ProfilePage";
import D_PatientList from "./Pages/D_patientList/D_PatientList";
import D_Overview from "./Pages/Overview/D_Overview";
import Sign_in from "./Pages/Sign_in/Sign_in";
import Sign_up from "./Pages/Sign_up/Sign_up";
import D_Appointment from "./Pages/D_Appointment/D_appointment";
import { useState } from "react";
import { useAuth } from "./Pages/Sign_in/AuthContext";

const App = () => {
  // const [login, setLogin] = useState(false);
  const { login } = useAuth();
  return (
    <Router>
      <div className="app">
        {!login ? (
          <>
            <Routes>
              <Route path="/login" element={<Sign_in />} />
            </Routes>
            <Routes>
              <Route path="/signup" element={<Sign_up />} />
            </Routes>
            <Routes>
              <Route path="/" element={<Sign_up />} />
            </Routes>
          </>
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
              {/* <Routes>
                <Route path="/" element />
              </Routes> */}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
