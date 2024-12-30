import React, { useState, useContext } from "react";
import "./P_appointment.css";
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import ArrowButton from "../../Components/D_PatientList/ArrowButton";
import DoctorList from "../../Components/D_PatientList/DocList";
import DoctorGrid from "../../Components/D_PatientList/DocGrid";
import { DoctorsDataContext } from "../../Components/APIs/getAllDr";
import { PatientDataContext } from "../../Components/APIs/PatientInfo";

const Today = new Date();
Today.setHours(0, 0, 0, 0); // Ensure Today's date has no time portion

const P_Appointment = () => {
  const [date, setDate] = useState(new Date(Today)); // State to manage date
  const [layout, setLayout] = useState("list"); // State to manage layout type
  const [filter, setFilter] = useState(""); // State to manage filter
  const { patient_type } = useContext(PatientDataContext) || {}; // Get patient type from context
  const [selectedButton, setSelectedButton] = useState(
    patient_type === "Ob/gyn" ? "Ob/gyn" : patient_type 
  ); // Automatically select button based on patient type
  const doctorsData = useContext(DoctorsDataContext); // Get doctors data from context
  const { patientData } = useContext(PatientDataContext); // Get patient data from context

  const handleDateChange = (days) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      // Ensure the date does not go below today
      return newDate < Today ? new Date(Today) : newDate;
    });
  };

  console.log("AAAAAAAAAAAAAA:", patient_type);
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

  const applyFilter = (doctors) => {
    switch (filter) {
      case "name-asc":
        return doctors.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return doctors.sort((a, b) => b.name.localeCompare(a.name));
      case "specialty":
        return doctors.sort((a, b) => a.specialty.localeCompare(b.specialty));
      case "experience":
        return doctors.sort((a, b) => b.experience - a.experience);
      default:
        return doctors;
    }
  };

  const filteredDoctors = applyFilter(doctorsData);

  console.log("Filtered Doctors:", filteredDoctors);
  console.log("Patient Data:", patientData);

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <div className="appointment-title">
          <h2>Appointment</h2>
          <p>
            <span className="bold-white">Showing:</span> All available doctors
          </p>
        </div>
        <div className="appointment-buttons">
          {/* <button
            className={`Cancer-button ${selectedButton === "Cancer" ? "active" : ""}`}
            onClick={() => setSelectedButton("Cancer")}
          >
            Cancer
          </button> */}
          <button
            className={`Obstetrics-button ${selectedButton === "Ob/gyn" ? "active" : ""}`}
            onClick={() => setSelectedButton("Ob/gyn")}
          >
            Ob/gyn
          </button>
          <button
            className={`Infant-button ${selectedButton === "Infant" ? "active" : ""}`}
            onClick={() => setSelectedButton("Infant")}
          >
            Infant
          </button>
        </div>
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
          <DoctorList doctors={filteredDoctors} formattedDate={formatDate(date)} />
        </div>
      )}
      {layout === "grid" && (
        <div className="cards-container grid">
          <DoctorGrid doctors={filteredDoctors} />
        </div>
      )}
    </div>
  );
};

export default P_Appointment;