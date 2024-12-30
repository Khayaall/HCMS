import React, { createContext, useState, useEffect } from 'react';

export const DoctorsDataContext = createContext();

export const DoctorsDataProvider = ({ children }) => {
  const [doctorsData, setDoctorsData] = useState([]);

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

        // Fetch all doctors
        const doctorsResponse = await fetch("http://localhost:5000/doctor/all", {
          method: "GET",
          headers: {
            'authorization': `Bearer ${token}`,
            'User-Id': id,
            'User-Role': role
          }
        });

        if (!doctorsResponse.ok) {
          throw new Error(`HTTP error! status: ${doctorsResponse.status}`);
        }

        const doctors = await doctorsResponse.json();

        // Log the fetched data
        console.log("Doctors Data:", doctors);

        setDoctorsData(doctors);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndMergeData();
  }, []);

  return (
    <DoctorsDataContext.Provider value={doctorsData}>
      {children}
    </DoctorsDataContext.Provider>
  );
};