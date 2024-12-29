import React, { useState, useEffect, useContext } from "react";
import "./d_appointment.css";
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import ArrowButton from "../../Components/D_PatientList/ArrowButton";
import PatientList from "../../Components/D_PatientList/patientListCard";
import PatientGrid from "../../Components/D_PatientList/patientGridCard";
import { MergedDataContext } from "../../Components/D_PatientList/AppointmentsWithPatients";

const Today = new Date();
Today.setHours(0, 0, 0, 0); // Ensure Today's date has no time portion

const D_Appointment = () => {
  const [date, setDate] = useState(new Date(Today)); // State to manage date
  const [layout, setLayout] = useState("list"); // State to manage layout type
  const [filter, setFilter] = useState(""); // State to manage filter
  const mergedData = useContext(MergedDataContext); // Get merged data from context

  const handleDateChange = (days) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      // Ensure the date does not go below today
      return newDate < Today ? new Date(Today) : newDate;
    });
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
        return patients.sort((a, b) => a.patientName.localeCompare(b.patientName));
      case "name-desc":
        return patients.sort((a, b) => b.patientName.localeCompare(a.patientName));
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

  const filteredPatients = applyFilter(
    mergedData.filter((patient) => {
      const appointmentDate = new Date(patient.date).toDateString();
      return appointmentDate === date.toDateString();
    })
  );

  console.log("Filtered Patients:", filteredPatients);

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
          <ArrowButton
            direction="left"
            onClick={() => handleDateChange(-1)}
            disabled={date.toDateString() === Today.toDateString()} // Disable if date matches today's date
          />
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
          <PatientList patients={filteredPatients} formattedDate={formatDate(date)} />
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
