import React, { useState, useEffect } from "react";
import "./MedicalRecord.css";
const API_URL = import.meta.env.VITE_API_URL;

const MedicalRecord = ({ patientData }) => {
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    birth_weight: "",
    feeding_method: "",
    vaccination_history: "",
    patient_history: "",
    pregnancy_stage: "",
    no_of_births: "",
    menstrual_cycle_details: "",
    labor_method: "",
  });

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role").toLowerCase();

        if (!token || !id || !role) {
          console.error("No token, id, or role found, please log in");
          return;
        }

        const response = await fetch(`${API_URL}/patient/medical-record`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        });

        if (response.status === 404) {
          console.error("Medical record not found");
          throw new Error("Medical record not found");
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response Error Text:", errorText);
          throw new Error(
            errorText || "An error occurred while fetching medical record."
          );
        }

        const data = await response.json();
        setMedicalRecord(data[0]); // Access the first element of the array
        console.log("Fetched medical record data:", data[0]); // Log the fetched medical record data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, []);

  useEffect(() => {
    if (medicalRecord) {
      setFormData({
        birth_weight: medicalRecord.birth_weight || "",
        feeding_method: medicalRecord.feeding_method || "",
        vaccination_history: medicalRecord.vaccination_history || "",
        patient_history: medicalRecord.patient_history || "",
        pregnancy_stage: medicalRecord.pregnancy_stage || "",
        no_of_births: medicalRecord.no_of_births || "",
        menstrual_cycle_details: medicalRecord.menstrual_cycle_details || "",
        labor_method: medicalRecord.labor_method || "",
      });
    }
  }, [medicalRecord]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const role = localStorage.getItem("role").toLowerCase();

      const response = await fetch(`${API_URL}/patient/edit-medical-record`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "An error occurred while editing medical record."
        );
      }

      const contentType = response.headers.get("content-type");
      let updatedRecord;
      if (contentType && contentType.includes("application/json")) {
        updatedRecord = await response.json();
      } else {
        const responseText = await response.text();
        console.warn("Response is not JSON:", responseText);
        updatedRecord = {
          ...medicalRecord,
          ...formData,
          message: responseText,
        };
      }

      setMedicalRecord(updatedRecord);
      setEditMode(false);
    } catch (error) {
      console.error("Error editing data:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p>
        {error === "Medical record not found"
          ? "No medical record available"
          : error}
      </p>
    );
  }

  if (!medicalRecord) {
    return <p>No medical record available</p>;
  }

  if (!patientData) {
    return <p>Invalid patient data</p>;
  }

  console.log("patientData.patient_id:", patientData.patient_id);
  console.log("medicalRecord.patient_id:", medicalRecord.patient_id);
  console.log("medicalRecord.patient_type:", medicalRecord.patient_type);

  if (patientData.patient_id === medicalRecord.patient_id) {
    if (patientData.patient_id === 3) {
      console.log(
        "medicalRecord.patient_type for patient_id 3:",
        medicalRecord.patient_type
      );
    }

    if (patientData.patient_type === "infant") {
      return (
        <div className="medical-record">
          <div className="BIG-Wrapper">
            <div className="medical-record-header">
              <div className="medical-record-title">
                <h3>Medical Record</h3>
                <p>
                  View your <strong>infant</strong> medical record
                </p>
              </div>
              <div className="edit-button-wrapper">
                {editMode ? (
                  <>
                    <button
                      className="cancel-button"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                    <button className="save-button" onClick={handleEditSubmit}>
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="fas fa-pen"></i> Edit
                  </button>
                )}
              </div>
            </div>
            <div className="medical-record-Structured">
              <div className="First-Col">
                {medicalRecord && (
                  <div className="Birth-Date">
                    <h4>Birth Weight</h4>
                    {editMode ? (
                      <input
                        type="text"
                        name="birth_weight"
                        value={formData.birth_weight}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>
                        {medicalRecord.birth_weight ||
                          "No birth weight available"}
                      </p>
                    )}
                  </div>
                )}
                {medicalRecord && (
                  <div className="allergies">
                    <h4>Allergies</h4>
                    <p>{medicalRecord.allergies || "No allergies available"}</p>
                  </div>
                )}
                {medicalRecord && (
                  <div className="Vaccines">
                    <h4>Vaccination History</h4>
                    {editMode ? (
                      <input
                        type="text"
                        name="vaccination_history"
                        value={formData.vaccination_history}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>
                        {medicalRecord.vaccination_history ||
                          "No vaccination history available"}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="Second-Col">
                {medicalRecord && (
                  <div className="Notes">
                    <h4>Diagnosis</h4>
                    <p>{medicalRecord.diagnosis || "No diagnosis available"}</p>
                  </div>
                )}
                {medicalRecord && (
                  <div className="juandice">
                    <h4>Juandice</h4>
                    <p>
                      {medicalRecord.juandice ||
                        "No juandice information available"}
                    </p>
                  </div>
                )}
                {medicalRecord && (
                  <div className="feeding_method">
                    <h4>Feeding Method</h4>
                    {editMode ? (
                      <input
                        type="text"
                        name="feeding_method"
                        value={formData.feeding_method}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>
                        {medicalRecord.feeding_method ||
                          "No feeding method available"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              {medicalRecord && (
                <div className="patient_history">
                  <h4>Patient history </h4>
                  {editMode ? (
                    <input
                      type="text"
                      name="patient_history"
                      value={formData.patient_history}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>
                      {medicalRecord.patient_history ||
                        "No patient history available"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="medical-record-content">
            <div className="medical-record-notes">
              <h4>Notes</h4>
              <p>{medicalRecord.notes || "No notes available"}</p>
            </div>
            <div className="medical-record-treatment">
              <h4>Treatment</h4>
              <p>{medicalRecord.treatment || "No treatment available"}</p>
            </div>
          </div>
        </div>
      );
    } else if (patientData.patient_type === "obstetrics") {
      if (patientData.patient_id === medicalRecord.patient_id) {
        console.log("medicalRecord.patient_type:", medicalRecord.patient_type);
        if (medicalRecord.patient_type === "Cancer") {
          return (
            <div className="medical-record">
              <div className="BIG-Wrapper">
                <div className="medical-record-header">
                  <div className="medical-record-title">
                    <h3>Medical Record</h3>
                    <p>
                      View your <strong>Cancer</strong> medical record
                    </p>
                  </div>
                </div>
                <div className="medical-record-Structured">
                  <div className="First-Col">
                    {medicalRecord && (
                      <div className="Notes">
                        <h4>Diagnosis</h4>
                        <p>
                          {medicalRecord.diagnosis || "No diagnosis available"}
                        </p>
                      </div>
                    )}
                    {medicalRecord && (
                      <div className="allergies">
                        <h4>Cancer Stage</h4>
                        <p>
                          {medicalRecord.cancer_stage ||
                            "No allergies available"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="Second-Col">
                    {medicalRecord && (
                      <div className="juandice">
                        <h4>Cancer Type</h4>
                        <p>
                          {medicalRecord.cancer_type ||
                            "No juandice information available"}
                        </p>
                      </div>
                    )}
                    {medicalRecord && (
                      <div className="feeding_method">
                        <h4>Treatment Period</h4>
                        <p>
                          {medicalRecord.c_treatment_period ||
                            "No feeding method available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {medicalRecord && (
                    <div className="wide-container">
                      <h4>Patient history </h4>
                      {editMode ? (
                        <input
                          type="text"
                          name="patient_history"
                          value={formData.patient_history}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>
                          {medicalRecord.patient_history ||
                            "No patient history available"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="medical-record-content">
                <div className="medical-record-notes">
                  <h4>Notes</h4>
                  <p>{medicalRecord.notes || "No notes available"}</p>
                </div>
                <div className="medical-record-treatment">
                  <h4>Treatment</h4>
                  <p>{medicalRecord.treatment || "No treatment available"}</p>
                </div>
              </div>
            </div>
          );
        } else if (medicalRecord.patient_type === "Pregnant") {
          return (
            <div className="medical-record">
              <div className="BIG-Wrapper">
                <div className="medical-record-header">
                  <div className="medical-record-title">
                    <h3>Medical Record</h3>
                    <p>
                      View your <strong>Pregnant</strong> medical record
                    </p>
                  </div>
                  <div className="edit-button-wrapper">
                    {editMode ? (
                      <>
                        <button
                          className="cancel-button"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="save-button"
                          onClick={handleEditSubmit}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => setEditMode(true)}
                      >
                        <i className="fas fa-pen"></i> Edit
                      </button>
                    )}
                  </div>
                </div>
                <div className="medical-record-Structured">
                  <div className="First-Col">
                    {medicalRecord && (
                      <div className="Notes">
                        <h4>Diagnosis</h4>
                        <p>
                          {medicalRecord.diagnosis || "No diagnosis available"}
                        </p>
                      </div>
                    )}
                    {medicalRecord && (
                      <div className="Birth-Date">
                        <h4>Pregnancy Stage</h4>
                        {editMode ? (
                          <input
                            type="text"
                            name="pregnancy_stage"
                            value={formData.pregnancy_stage}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>
                            {medicalRecord.pregnancy_stage ||
                              "No pregnancy stage available"}
                          </p>
                        )}
                      </div>
                    )}
                    {medicalRecord && (
                      <div className="Vaccines">
                        <h4>No.of Birth</h4>
                        {editMode ? (
                          <input
                            type="text"
                            name="no_of_births"
                            value={formData.no_of_births}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>
                            {medicalRecord.no_of_births ||
                              "No number of births available"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="Second-Col">
                    {medicalRecord && (
                      <div className="feeding_method">
                        <h4>Menstrual Cycle Details</h4>
                        {editMode ? (
                          <input
                            type="text"
                            name="menstrual_cycle_details"
                            value={formData.menstrual_cycle_details}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>
                            {medicalRecord.menstrual_cycle_details ||
                              "No menstrual cycle details available"}
                          </p>
                        )}
                      </div>
                    )}
                    {medicalRecord && (
                      <div className="juandice">
                        <h4>Labor Method</h4>
                        {editMode ? (
                          <input
                            type="text"
                            name="labor_method"
                            value={formData.labor_method}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>
                            {medicalRecord.labor_method === "N/A" ||
                            medicalRecord.labor_method === "0"
                              ? "to be edited by dr"
                              : medicalRecord.labor_method}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {medicalRecord && (
                    <div className="wide-container">
                      <h4>Patient history </h4>
                      {editMode ? (
                        <input
                          type="text"
                          name="patient_history"
                          value={formData.patient_history}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>
                          {medicalRecord.patient_history ||
                            "No patient history available"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="medical-record-content">
                <div className="medical-record-notes">
                  <h4>Notes</h4>
                  <p>{medicalRecord.notes || "No notes available"}</p>
                </div>
                <div className="medical-record-treatment">
                  <h4>Treatment</h4>
                  <p>{medicalRecord.treatment || "No treatment available"}</p>
                </div>
              </div>
            </div>
          );
        } else {
          return <p>Invalid patient type</p>;
        }
      } else {
        return <p>Patient ID does not match</p>;
      }
    } else {
      return <p>Invalid patient type</p>;
    }
  } else {
    return <p>Invalid patient type</p>;
  }
};

export default MedicalRecord;
