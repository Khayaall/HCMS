import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./d_patientdetails.css";
import PatientDetailsTable from "../../Components/PatientDetails/PatientDetailsTable";

const D_patientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState({});
  const [patientType, setPatientType] = useState(""); // State to store patient type
  const [cancerData, setCancerData] = useState([]);
  const [infantData, setInfantData] = useState([]);
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
  const [newInfantData, setNewInfantData] = useState({
    vaccination_date: "",
    vaccine_type: "",
    temprature: "",
    weight: "",
    age: "",
    immune_system_status: "",
    heart_rate: "",
    vaccination_instructions: "",
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
      setPatientType(patients.patient_type);
      console.log("patientsssss" + patients);
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
      {
      }
      setCancerData(cancerData);
      console.log(cancerData);
    } catch (error) {
      console.error("Error fetching cancer data:", error);
      throw new Error("Failed to fetch cancer details");
    }
  };
  const fetchInfantData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/infant_treatment_plan/${patientId}`,
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
        throw new Error("Failed to fetch infant treatment plan");
      }
      const infantData = await response.json();
      setInfantData(infantData);
      console.log("alllloiejfoiwjfewoi" + infantData);
    } catch (error) {
      console.error("Error fetching infant data:", error);
    }
  };

  const handleModifyClick = (dataId) => {
    const dataToEdit =
      patientType === "obstetrics"
        ? cancerData.find((data) => data.id === dataId)
        : infantData.find((data) => data.id === dataId);
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
      if (patientType === "obstetrics") {
        setCancerData((prevData) =>
          prevData.map((data) =>
            data.id === updatedData.id ? updatedData : data
          )
        );
      } else {
        setInfantData((prevData) =>
          prevData.map((data) =>
            data.id === updatedData.id ? updatedData : data
          )
        );
      }
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
    if (patientType === "obstetrics") {
      setNewCancerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setNewInfantData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patientType === "obstetrics") {
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
    } else {
      fetchCancer(newInfantData);
      setNewInfantData({
        vaccination_date: "",
        vaccine_type: "",
        temprature: "",
        weight: "",
        age: "",
        immune_system_status: "",
        heart_rate: "",
        vaccination_instructions: "",
      });
    }
  };

  useEffect(() => {
    fetchPatient();
    // fetchCancer();
    fetchCancerData();
    fetchInfantData();
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
      </div>
      <PatientDetailsTable
        patientDetails={patientType === "obstetrics" ? cancerData : infantData}
        formatDate={formatDate}
        onModifyClick={handleModifyClick}
        onSaveClick={handleSaveClick}
        editingData={editingData}
        setEditingData={setEditingData}
        patientType={patientType} // Pass patientType to the table
      />

      <div className="patient-input">
        <h2>
          Add New {patientType === "obstetrics" ? "obstetrics" : "Infant"}{" "}
          Treatment Plan
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="patient-inputs">
            {patientType === "obstetrics" ? (
              <>
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
              </>
            ) : (
              <>
                <input
                  type="date"
                  name="vaccination_date"
                  value={newInfantData.vaccination_date}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="vaccine_type"
                  placeholder="Vaccine Type"
                  value={newInfantData.vaccine_type}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  value={newInfantData.weight}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="temprature"
                  placeholder="Temperature"
                  value={newInfantData.temprature}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={newInfantData.age}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="vaccination_instructions"
                  placeholder="Vaccination Instructions"
                  value={newInfantData.vaccination_instructions}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="immune_system_status"
                  placeholder="Immune System Status"
                  value={newInfantData.immune_system_status}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="heart_rate"
                  placeholder="Heart Rate"
                  value={newInfantData.heart_rate}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
          </div>
          <button type="submit">Add Treatment Plan</button>
        </form>
      </div>
    </div>
  );
};

export default D_patientDetails;
