import React from "react";
import "./patientDetailsTable.css";

const PatientDetailsTable = ({ patientDetails }) => {
  return (
    // <div>
    //   <table className="patient-details-table">
    //     <thead>
    //       <tr>
    //         <th className="patient-details-header">Patient Name</th>
    //         <th>Patient ID</th>
    //         <th>Date</th>
    //         <th>Gender</th>
    //         <th>Diagnosis</th>
    //         <th>Status</th>
    //         <th>Treatment</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {patients.map((patient, index) => (
    //         <tr key={`${patient.patient_id}-${index}`} className="patient-tr">
    //           <td className="patient-details-name">
    //             <img
    //               src={patient.image}
    //               alt={patient.patientName}
    //               className="patient-img"
    //             />
    //             {patient.patientName}
    //           </td>
    //           <td>{patient.patient_id}</td>
    //           <td>{patient.date}</td>
    //           <td>{patient.gender}</td>
    //           <td>{patient.diagnosis}</td>
    //           <td>{patient.status}</td>
    //           <td>{patient.treatment}</td>
    //           <td>
    //             <button className="action-button">⋮</button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
    <div className="patient-records">
      {patientDetails.length > 0 ? (
        patientDetails.map((plan, index) => (
          <div key={index} className="patient-record-container">
            <h3>{plan.session_date}</h3>
            <div className="patient-record">
              <div className="record-top-row">
                <div className="single-records">
                  <h4>Cancer Stage</h4>
                  <p>{plan.cancer_stage}</p>
                </div>
                <div className="single-records">
                  <h4>Dosage</h4>
                  <p>{plan.dosage}</p>
                </div>
                <div className="single-records">
                  <h4>Heart Rate</h4>
                  <p>{plan.heart_rate}</p>
                </div>
              </div>
              <div className="record-bottom-row">
                <div className="single-records">
                  <h4>Treatment Type</h4>
                  <p>{plan.treatment_type}</p>
                </div>
                <div className="single-records">
                  <h4>Age</h4>
                  <p>{plan.age}</p>
                </div>
                <div className="single-records">
                  <h4>Blood Pressure</h4>
                  <p>{plan.blood_pressure}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No cancer treatment plan available.</p>
      )}
    </div>
  );
};

export default PatientDetailsTable;
