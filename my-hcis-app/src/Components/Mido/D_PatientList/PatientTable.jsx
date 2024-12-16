import React from "react";
import "../../../Pages/D_patientList/D_PatientList.css"; // Make sure to import the CSS file

const PatientTable = ({ patients }) => {
  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th className="patient-name-header">Patient Name</th>
          <th>Patient ID</th>
          <th>Date</th>
          <th>Gender</th>
          <th>Disease</th>
          <th>Status</th>
          <th>Payment</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.id} className="patient-tr">
            <td className="patient-name">
              <img
                src={patient.image}
                alt={patient.name}
                className="patient-img"
              />
              {patient.name}
            </td>
            <td>{patient.patientID}</td>
            <td>{patient.date}</td>
            <td>{patient.gender}</td>
            <td>{patient.disease}</td>
            <td>{patient.status}</td>
            <td>{patient.payment}</td>
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
