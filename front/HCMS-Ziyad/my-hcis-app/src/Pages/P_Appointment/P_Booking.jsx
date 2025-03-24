import React, { useState, useContext, useEffect } from "react";
import "./P_booking.css";
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import DoctorList from "../../Components/D_PatientList/DocList";
import DoctorGrid from "../../Components/D_PatientList/DocGrid";
import { DoctorsDataContext } from "../../Components/APIs/getAllDr";
import { PatientDataContext } from "../../Components/APIs/PatientInfo";
const API_URL = import.meta.env.VITE_API_URL;

const P_Booking = () => {
  const [layout, setLayout] = useState("list"); // State to manage layout type
  const [filter, setFilter] = useState(""); // State to manage filter
  const { patient_type } = useContext(PatientDataContext) || {}; // Get patient type from context
  const [selectedButton, setSelectedButton] = useState(
    patient_type === "obstetrics"
      ? "Ob/gyn"
      : patient_type === "infant"
      ? "Infant"
      : "Ob/gyn"
  ); // Automatically select button based on patient type
  const [type, setType] = useState(
    selectedButton === "Ob/gyn"
      ? "obstetrics"
      : selectedButton === "Infant"
      ? "infant"
      : "obstetrics"
  ); // Automatically select type based on selected button
  const [doctorsData, setDoctorsData] = useState([]); // State to manage doctors data
  const { patientData } = useContext(PatientDataContext); // Get patient data from context
  const [filteredDoctors, setFilteredDoctors] = useState([]); // State to manage filtered doctors

  console.log("Selected Button:", selectedButton);
  console.log("Type:", type);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const role = localStorage.getItem("role").toLowerCase();

      if (!token || !id || !role) {
        console.error("No token, id, or role found, please log in");
        return;
      }

      // Append selectedButton as a query parameter
      const response = await fetch(
        `${API_URL}/patient/browse-selected-doctors/${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response Error Text:", errorText);
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      // console.log("Fetched Doctors Data:", data); // Log the fetched data
      setDoctorsData(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [type]);

  useEffect(() => {
    setType(selectedButton === "Ob/gyn" ? "obstetrics" : "infant");
  }, [selectedButton]);

  const applyFilter = (doctors) => {
    if (!doctors || doctors.length === 0) return [];
    switch (filter) {
      case "name-asc":
        return doctors.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return doctors.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      case "specialty":
        return doctors.sort((a, b) =>
          (a.specialty || "").localeCompare(b.specialty || "")
        );
      case "experience":
        return doctors.sort(
          (a, b) => (b.experience || 0) - (a.experience || 0)
        );
      default:
        return doctors;
    }
  };

  useEffect(() => {
    setFilteredDoctors(applyFilter(doctorsData));
  }, [filter, doctorsData]);

  const toggleLayout = (layoutType) => {
    setLayout(layoutType);
  };

  return (
    <div className="appointment-container">
      <div className="booking-header">
        <div className="appointment-title">
          <h2>Appointment</h2>
          <p>
            <span className="bold-white">Showing:</span> All available doctors
          </p>
        </div>
        <div className="appointment-buttons">
          <button
            className={`Obstetrics-button ${
              selectedButton === "Ob/gyn" ? "active" : ""
            }`}
            onClick={() => setSelectedButton("Ob/gyn")}
          >
            Ob/gyn
          </button>
          <button
            className={`Infant-button ${
              selectedButton === "Infant" ? "active" : ""
            }`}
            onClick={() => setSelectedButton("Infant")}
          >
            Infant
          </button>
        </div>
      </div>
      <div className="appointment-controls">
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
        <div className="filter-dropdown-container">
          <FilterDropdown
            filter={filter}
            setFilter={setFilter}
            className="filter-dropdown-right"
          />
        </div>
      </div>
      {layout === "list" && (
        <div className="cards-container list">
          <DoctorList doctors={filteredDoctors} />
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

export default P_Booking;
