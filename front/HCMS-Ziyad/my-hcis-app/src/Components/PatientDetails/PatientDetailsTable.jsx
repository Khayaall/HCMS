import React from "react";
import "./patientDetailsTable.css";

const PatientDetailsTable = ({ patientDetails }) => {
  return (
    <div>
      <table className="patient-details-table">
        <thead>
          <tr>
            <th className="patient-details-header">Patient Name</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Gender</th>
            <th>Diagnosis</th>
            <th>Status</th>
            <th>Treatment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={`${patient.patient_id}-${index}`} className="patient-tr">
              <td className="patient-details-name">
                <img
                  src={patient.image}
                  alt={patient.patientName}
                  className="patient-img"
                />
                {patient.patientName}
              </td>
              <td>{patient.patient_id}</td>
              <td>{patient.date}</td>
              <td>{patient.gender}</td>
              <td>{patient.diagnosis}</td>
              <td>{patient.status}</td>
              <td>{patient.treatment}</td>
              <td>
                <button className="action-button">⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDetailsTable;
