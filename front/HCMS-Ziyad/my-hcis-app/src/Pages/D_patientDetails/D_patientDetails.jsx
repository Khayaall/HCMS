import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./d_patientdetails.css";
import PatientDetailsTable from "../../Components/PatientDetails/PatientDetailsTable";

const D_patientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState({});
  const [cancer, setCancer] = useState({});

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
        `http://localhost:5000/doctor/edit_treatment_plan/${patientId}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cancer details");
      }
      const cancerr = await resp.json();
      setCancer(cancerr);
      console.log(cancerr);
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
      throw new Error("Failed to fetch doctor stats");
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchCancer();
  }, []);

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
