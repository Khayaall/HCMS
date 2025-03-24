import React, { createContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export const ReviewsDataContext = createContext();

export const ReviewsDataProvider = ({ children }) => {
  const [reviewsData, setReviewsData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

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

        // Fetch patients and reviews
        const patientsResponse = await fetch(`${API_URL}/doctor/patients`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        const reviewsResponse = await fetch(`${API_URL}/doctor/reviews`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        if (!patientsResponse.ok || !reviewsResponse.ok) {
          throw new Error(
            `HTTP error! status: ${patientsResponse.status} ${reviewsResponse.status}`
          );
        }

        const patients = await patientsResponse.json();
        const reviews = await reviewsResponse.json();

        // Print fetched data
        console.log("Patients Data:", patients);
        console.log("Reviews Data:", reviews);

        // Merge data
        const merged = reviews
          .map((review) => {
            const patient = patients.find(
              (p) => p.patient_id === review.patient_id
            );
            if (patient) {
              // Format the date to YYYY-MM-DD
              const formattedDate = new Date(review.date_issue)
                .toISOString()
                .slice(0, 10);

              return {
                patient_id: patient.patient_id, // Add patient_id for unique key
                patientName: `${patient.f_name} ${patient.l_name}`,
                job: patient.job,
                patient_type: patient.patient_type, // Get patient_type from patient data
                date: formattedDate,
                rating: review.rating,
                comment: review.comment,
                image: patient.image_url, // Include image URL
                gender: patient.gender, // Include gender from patient data
              };
            }
            return null; // Skip if patient not found
          })
          .filter(Boolean); // Remove nulls

        // Log the merged data
        console.log("Reviews Data:", merged);

        setReviewsData(merged);

        // Calculate average rating
        const totalRating = merged.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating = merged.length ? totalRating / merged.length : 0;
        setAverageRating(avgRating);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndMergeData();
  }, []);

  return (
    <ReviewsDataContext.Provider value={{ reviewsData, averageRating }}>
      {children}
    </ReviewsDataContext.Provider>
  );
};
