import React, { useState, useEffect } from "react";
import "./d_appointment.css";
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import ArrowButton from "../../Components/D_PatientList/ArrowButton";
import PatientList from "../../Components/D_PatientList/patientListCard";
import PatientGrid from "../../Components/D_PatientList/patientGridCard";

const Today = new Date();
Today.setDate(Today.getDate());

const D_Appointment = () => {
  const [date, setDate] = useState(new Date(Today)); // State to manage date
  const [layout, setLayout] = useState("list"); // State to manage layout type
  const [filter, setFilter] = useState(""); // State to manage filter
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patients, setPatients] = useState([]); // State to manage patients data

  const handleDateChange = (days) => {
    setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + days)));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleLayout = (layoutType) => {
    setLayout(layoutType);
  };

  const applyFilter = (patients) => {
    switch (filter) {
      case "name-asc":
        return patients.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return patients.sort((a, b) => b.name.localeCompare(a.name));
      case "date":
        return patients.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "disease":
        return patients.sort((a, b) => a.disease.localeCompare(b.disease));
      case "status":
        return patients.sort((a, b) => a.status.localeCompare(b.status));
      case "gender":
        return patients.sort((a, b) => a.gender.localeCompare(b.gender));
      default:
        return patients;
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role").toLowerCase();
        if (!token || !id || !role) {
          console.error("No token, id, or role found, please log in");
          return;
        }

        const response = await fetch("http://localhost:5000/doctor/patients", {
          method: "GET",
          headers: {
            'authorization': `Bearer ${token}`,
            'User-Id': id,
            'User-Role': role
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients data:", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const filteredPatients = applyFilter(
      patients.filter((patient) => {
        const appointmentDate = new Date(patient.date);
        return formatDate(appointmentDate) === formatDate(date);
      })
    );
    setFilteredPatients(filteredPatients);
  }, [date, filter, patients]);

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h2>Appointment</h2>
        <p>
          <span className="bold-white">Showing:</span> All upcoming patients
        </p>
      </div>
      <div className="layout-toggle-buttons">
        <button
          className={`layout-button ${layout === "list" ? "active" : ""}`}
          onClick={() => toggleLayout("list")}
        >
          List
        </button>
        <button
          className={`layout-button ${layout === "grid" ? "active" : ""}`}
          onClick={() => toggleLayout("grid")}
        >
          Grid
        </button>
      </div>
      <div className="appointment-controls">
        <div className="date-controls">
          <span className="date-display">{formatDate(date)}</span>
          <ArrowButton direction="left" onClick={() => handleDateChange(-1)} />
          <ArrowButton direction="right" onClick={() => handleDateChange(1)} />
        </div>
        <div className="filter-dropdown-container">
          <FilterDropdown
            filter={filter}
            setFilter={setFilter}
            className="filter-dropdown-left"
          />
        </div>
      </div>
      {layout === "list" && (
        <div className="cards-container list">
          <PatientList patients={filteredPatients} />
        </div>
      )}
      {layout === "grid" && (
        <div className="cards-container grid">
          <PatientGrid patients={filteredPatients} />
        </div>
      )}
    </div>
  );
};

export default D_Appointment;