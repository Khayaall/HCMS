import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./d_patientdetails.css";
import PatientDetailsTable from "../../Components/PatientDetails/PatientDetailsTable";

const D_patientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState({});
  const [cancerData, setCancerData] = useState({});
  const [editingData, setEditingData] = useState(null);
  const [newCancerData, setNewCancerData] = useState({
    session_date: "",
    cancer_stage: "",
    dosage: "",
    age: "",
    blood_pressure: "",
    heart_rate: "",
    treatment_type: "",
  });

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();

  const fetchPatient = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/patient_details/${patientId}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": patientId,
            "User-Role": role,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch doctor stats");
      }
      const patients = await response.json();
      setPatient(patients);
      console.log(patients);
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
      throw new Error("Failed to fetch doctor stats");
    }
  };
  const fetchCancer = async (newData) => {
    try {
      const resp = await fetch(
        `http://localhost:5000/doctor/treatment_plan/${patientId}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );
      console.log(resp);
      if (!resp.ok) {
        throw new Error("Failed to fetch cancer details");
      }
      fetchCancerData();
    } catch (error) {
      console.error("Error fetching cancer:", error);
      throw new Error("Failed to fetch cancer details");
    }
  };
  const fetchCancerData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/get_cancer_treatment_plan/${patientId}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cancerrrr");
      }
      const cancerData = await response.json();
      setCancerData(cancerData);
      console.log(cancerData);
    } catch (error) {
      console.error("Error fetching cancer data:", error);
      throw new Error("Failed to fetch cancer details");
    }
  };

  const handleModifyClick = (cancerId) => {
    const dataToEdit = cancerData.find((data) => data.id === cancerId);
    setEditingData(dataToEdit);
  };
  const handleSaveClick = async (updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/edit_treatment_plan/${updatedData.id}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update cancer details");
      }
      setCancerData((prevData) =>
        prevData.map((data) =>
          data.id === updatedData.id ? updatedData : data
        )
      );
      setEditingData(null);
    } catch (error) {
      console.error("Error updating cancer details:", error);
      throw new Error("Failed to update cancer details");
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
      .replace(/(\d+), (\d+)/, "$1, $2");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCancerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCancer(newCancerData);
    setNewCancerData({
      session_date: "",
      cancer_stage: "",
      dosage: "",
      age: "",
      blood_pressure: "",
      heart_rate: "",
      treatment_type: "",
    });
  };

  useEffect(() => {
    fetchPatient();
    // fetchCancer();
    fetchCancerData();
    // fetchEditCancer();
  }, [patientId]);
  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="D-patientDetails">
      <div className="patientDetails-container">
        <div className="patient-Details">
          <h1>Patient Details</h1>
          <div className="patient-info">
            <div className="patient-info-img">
              <img src={patient.image_url} alt={patient.f_name} />
            </div>
            <h3>{patient.f_name + " " + patient.l_name}</h3>
          </div>
        </div>
        <PatientDetailsTable
          patientDetails={cancerData}
          formatDate={formatDate}
          onModifyClick={handleModifyClick}
          onSaveClick={handleSaveClick}
          editingData={editingData}
          setEditingData={setEditingData}
        />
        <div className="patient-input">
          <h2>Add New Cancer Treatment Plan</h2>
          <form onSubmit={handleSubmit}>
            <div className="patient-inputs">
              <input
                type="date"
                name="session_date"
                value={newCancerData.session_date}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="cancer_stage"
                placeholder="Cancer Stage"
                value={newCancerData.cancer_stage}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="dosage"
                placeholder="Dosage"
                value={newCancerData.dosage}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={newCancerData.age}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="blood_pressure"
                placeholder="Blood Pressure"
                value={newCancerData.blood_pressure}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="heart_rate"
                placeholder="Heart Rate"
                value={newCancerData.heart_rate}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="treatment_type"
                placeholder="Treatment Type"
                value={newCancerData.treatment_type}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Add Treatment Plan</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default D_patientDetails;
