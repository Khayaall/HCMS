import React, { createContext, useState, useEffect } from "react";
const API_URL = process.env.VITE_API_URL;

export const AppointmentsDataContext = createContext();

export const AppointmentsDataProvider = ({ children }) => {
  const [mergedData, setMergedData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();

  const fetchAndMergeData = async () => {
    try {
      if (!token || !id || !role) {
        console.error("No token, id, or role found, please log in");
        return;
      }

      // Fetch appointments
      const response = await fetch(`${API_URL}/patient/appointments`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const appointments = await response.json();
      setAppointmentData(appointments);

      // Print fetched data
      console.log("Appointments Data:", appointmentData);

      // Format and set data
      const formattedData = appointments.map((appointment) => {
        // Format the date to US style MM/DD/YYYY
        const formattedDate = new Date(appointment.date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );

        return {
          appointment_id: appointment.appointment_id,
          patient_id: appointment.patient_id,
          date: formattedDate,
          session_period: appointment.session_period,
          diagnosis: appointment.diagnosis,
          treatment: appointment.treatment,
          status: appointment.status,
        };
      });

      // Log the formatted data
      console.log("Formatted Data:", formattedData);

      setMergedData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAndMergeData();
  }, []);

  return (
    <AppointmentsDataContext.Provider value={mergedData}>
      {children}
    </AppointmentsDataContext.Provider>
  );
};
