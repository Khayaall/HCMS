import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./d_patientdetails.css";
import PatientDetailsTable from "../../Components/PatientDetails/PatientDetailsTable";

const D_patientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState({});
  const [cancerData, setCancerData] = useState({});

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
  const fetchCancer = async () => {
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
          body: JSON.stringify({
            session_date: "2024-12-30",
            cancer_stage: "1",
            dosage: "40mg",
            age: "45",
            blood_pressure: "120/80",
            heart_rate: "70",
            treatment_type: "Follow-up Care",
          }),
        }
      );
      console.log(resp);
      if (!resp.ok) {
        throw new Error("Failed to fetch cancer details");
      }
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
  const fetchEditCancer = async () => {
    try {
      const resp = await fetch(
        `http://localhost:5000/doctor/edit_treatment_plan/${patientId}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_date: "2024-12-30",
            cancer_stage: "1",
            dosage: "40mg",
            age: "45",
            blood_pressure: "120/80",
            heart_rate: "70",
            treatment_type: "Follow-up Care",
          }),
        }
      );
      console.log(resp);
      if (!resp.ok) {
        throw new Error("Failed to fetch cancer details");
      }
    } catch (error) {
      console.error("Error fetching cancer:", error);
      throw new Error("Failed to fetch cancer details");
    }
  };

  useEffect(() => {
    fetchPatient();
    // fetchCancer();
    fetchCancerData();
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
        {/* <PatientDetailsTable patientDetails={} /> */}
        <div className="patient-Input">
          <p>Fill in the details below</p>
          <input type="text" placeholder="Patient Name" />
          <input type="text" placeholder="Patient Age" />
        </div>
      </div>
    </div>
  );
};

export default D_patientDetails;
