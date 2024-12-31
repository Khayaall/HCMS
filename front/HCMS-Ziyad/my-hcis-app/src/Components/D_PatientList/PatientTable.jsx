import React from "react";
import "../../Pages/D_patientList/D_PatientList.css"; // Make sure to import the CSS file

const PatientTable = ({ patients }) => {
  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th className="patient-name-header">Patient Name</th>
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
            <td className="patient-name">
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
  );
};

export default PatientTable;