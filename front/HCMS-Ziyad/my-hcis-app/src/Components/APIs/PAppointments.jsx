import React, { createContext, useState, useEffect } from 'react';

export const AppointmentsDataContext = createContext();

export const AppointmentsDataProvider = ({ children }) => {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role").toLowerCase();
        if (!token || !id || !role) {
          console.error("No token, id, or role found, please log in");
          return;
        }

        // Fetch appointments
        const appointmentsResponse = await fetch("http://localhost:5000/patient/appointments", {
          method: "GET",
          headers: {
            'authorization': `Bearer ${token}`,
            'User-Id': id,
            'User-Role': role
          }
        });

        if (!appointmentsResponse.ok) {
          throw new Error(`HTTP error! status: ${appointmentsResponse.status}`);
        }

        const appointments = await appointmentsResponse.json();

        // Print fetched data
        console.log("Appointments Data:", appointments);

        // Format and set data
        const formattedData = appointments.map((appointment) => {
          // Format the date to US style MM/DD/YYYY
          const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          return {
            appointment_id: appointment.appointment_id,
            patient_id: appointment.patient_id,
            date: formattedDate,
            session_period: appointment.session_period,
            diagnosis: appointment.diagnosis,
            treatment: appointment.treatment,
            status: appointment.status
          };
        });

        // Log the formatted data
        console.log("Formatted Data:", formattedData);

        setMergedData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndMergeData();
  }, []);

  return (
    <AppointmentsDataContext.Provider value={mergedData}>
      {children}
    </AppointmentsDataContext.Provider>
  );
};