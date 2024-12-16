import React from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Navbar/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import D_ProfilePage from "./Components/D_ProfilePage1.jsx/D_ProfilePage";

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <div className="sidebar-content">
            <Sidebar />
          </div>
          <div className="navbar-content">
            <Navbar />
          </div>
          <div className="data">
            <Routes>
              <Route path="/overview" element />
            </Routes>
            <Routes>
              <Route path="/appointment" element />
            </Routes>
            <Routes>
              <Route path="/mypatient" element />
            </Routes>
            <Routes>
              <Route path="/settings" element={<D_ProfilePage />} />
            </Routes>
            <Routes>
              <Route path="/" />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
