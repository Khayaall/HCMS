import React, { createContext, useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export const MergedDataContext = createContext();

export const MergedDataProvider = ({ children }) => {
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

        // Fetch patients and appointments
        const patientsResponse = await fetch(`${API_URL}/doctor/patients`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        const appointmentsResponse = await fetch(
          `${API_URL}/doctor/all_appointments`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
              "User-Id": id,
              "User-Role": role,
            },
          }
        );

        if (!patientsResponse.ok || !appointmentsResponse.ok) {
          throw new Error(
            `HTTP error! status: ${patientsResponse.status} ${appointmentsResponse.status}`
          );
        }

        const patients = await patientsResponse.json();
        const appointments = await appointmentsResponse.json();

        // Print fetched data
        // console.log("Patients Data:", patients);
        // console.log("Appointments Data:", appointments);

        // Merge data
        const merged = appointments
          .map((appointment) => {
            const patient = patients.find(
              (p) => p.patient_id === appointment.patient_id
            );
            if (patient) {
              // Format the date to US style MM/DD/YYYY
              const formattedDate = new Date(
                appointment.date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              // Function to format time to 12-hour format with AM/PM
              const formatTime = (time) => {
                const [hours, minutes, seconds] = time.split(":").map(Number);
                const ampm = hours >= 12 ? "PM" : "AM";
                const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
                return `${formattedHours}:${formattedMinutes} ${ampm}`;
              };

              // Format the start and end time
              const startTime = formatTime(appointment.start_time);
              const endTime = formatTime(appointment.end_time);
              const timeRange = `${startTime} - ${endTime}`;

              return {
                patient_id: patient.patient_id, // Add patient_id for unique key
                patientName: `${patient.f_name} ${patient.l_name}`,
                job: patient.job,
                patient_type: patient.patient_type, // Get patient_type from patient data
                date: formattedDate,
                timeRange: timeRange, // Include the formatted time range
                image: patient.image_url, // Include image URL
                gender: patient.gender, // Include gender from patient data
                start_time: startTime, // Include start_time from appointment data
                diagnosis: appointment.diagnosis, // Include diagnosis from appointment data
                status: appointment.status, // Include status from appointment data
                treatment: appointment.treatment, // Include treatment from appointment data
              };
            }
            return null; // Skip if patient not found
          })
          .filter(Boolean); // Remove nulls

        // Log the merged data
        // console.log("Merged Data:", merged);

        setMergedData(merged);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndMergeData();
  }, []);

  return (
    <MergedDataContext.Provider value={mergedData}>
      {children}
    </MergedDataContext.Provider>
  );
};
