import React from 'react';

const AppointmentsWithPatients = ({ appointments }) => {
  if (!appointments) {
    return <div>Loading...</div>;
  }

  return (
    <table className="appointment-table">
      <thead>
        <tr>
          <th>Appointment ID</th>
          <th>Patient ID</th>
          <th>Date</th>
          <th>Session Period</th>
          <th>Diagnosis</th>
          <th>Treatment</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => (
          <tr key={appointment.appointment_id} className="appointment-tr">
            <td>{appointment.appointment_id}</td>
            <td>{appointment.patient_id}</td>
            <td>{appointment.date}</td>
            <td>{appointment.session_period}</td>
            <td>{appointment.diagnosis || "to be edited by Dr"}</td>
            <td>{appointment.treatment || "to be edited by Dr"}</td>
            <td>{appointment.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentsWithPatients;