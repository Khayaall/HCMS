import React, { createContext, useState, useEffect } from 'react';

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
        const patientsResponse = await fetch("http://localhost:5000/doctor/patients", {
          method: "GET",
          headers: {
            'authorization': `Bearer ${token}`,
            'User-Id': id,
            'User-Role': role
          }
        });

        const appointmentsResponse = await fetch("http://localhost:5000/doctor/all_appointments", {
          method: "GET",
          headers: {
            'authorization': `Bearer ${token}`,
            'User-Id': id,
            'User-Role': role
          }
        });

        if (!patientsResponse.ok || !appointmentsResponse.ok) {
          throw new Error(`HTTP error! status: ${patientsResponse.status} ${appointmentsResponse.status}`);
        }

        const patients = await patientsResponse.json();
        const appointments = await appointmentsResponse.json();

        // Print fetched data
        console.log("Patients Data:", patients);
        console.log("Appointments Data:", appointments);

        // Merge data
        const merged = appointments.map((appointment) => {
          const patient = patients.find(
            (p) => p.patient_id === appointment.patient_id
          );
          if (patient) {
            // Format the date to US style MM/DD/YYYY
            const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });

            // Format the start and end time
            const formatTime = (time) => {
              const date = new Date(time);
              let hours = date.getHours();
              let minutes = date.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              const minutesStr = minutes < 10 ? '0' + minutes : minutes;
              return `${hours}:${minutesStr} ${ampm}`;
            };

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
              image: patient.image_url // Include image URL
            };
          }
          return null; // Skip if patient not found
        }).filter(Boolean); // Remove nulls

        // Log the merged data
        console.log("Merged Data:", merged);

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