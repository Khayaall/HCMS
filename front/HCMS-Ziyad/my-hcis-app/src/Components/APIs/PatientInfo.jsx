import React, { createContext, useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export const PatientDataContext = createContext();

export const PatientDataProvider = ({ children }) => {
  const [patientData, setPatientData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role").toLocaleLowerCase();

        if (!token || !id || !role) {
          console.error("No token, id, or role found, please log in");
          return;
        }

        console.log("Token:", token);
        console.log("ID:", id);
        console.log("Role:", role);

        const response = await fetch(`${API_URL}/patient/`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response Error Text:", errorText);
          throw new Error("An error occurred while fetching patient profile.");
        }

        const data = await response.json();
        setPatientData(data);

        console.log("Patient Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchPatientData();
  }, []);

  const patient_type = patientData.patient_type || "Ob/gyn"; // Default to "Ob/gyn" if undefined

  return (
    <PatientDataContext.Provider value={{ patientData, patient_type, error }}>
      {children}
    </PatientDataContext.Provider>
  );
};
