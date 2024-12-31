import React, { useState } from "react";
import "./patientDetailsTable.css";

const PatientDetailsTable = ({
  patientDetails,
  formatDate,
  onModifyClick,
  onSaveClick,
  editingData,
  setEditingData,
  patientType,
}) => {
  const [visible, setVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="patient-records">
      {patientDetails.length > 0 ? (
        patientDetails.map((plan, index) => (
          <div key={index} className="patient-record-container">
            <div className="patient-record-header">
              <h3 onClick={() => setVisible(!visible)}>
                {formatDate(plan.session_date || plan.vaccination_date)}
              </h3>
              <button onClick={() => onModifyClick(plan.id)}>Modify</button>
            </div>
            {visible && (
              <div className="patient-record">
                {editingData && editingData.id === plan.id ? (
                  <div className="editing-records">
                    <div className="record-top-row">
                      {patientType === "obstetrics" ? (
                        <>
                          <div className="single-records">
                            <h4>Cancer Stage</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="cancer_stage"
                              value={editingData.cancer_stage}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Dosage</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="dosage"
                              value={editingData.dosage}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Heart Rate</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="heart_rate"
                              value={editingData.heart_rate}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="single-records">
                            <h4>Vaccine Type</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="vaccine_type"
                              value={editingData.vaccine_type}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Temperature</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="temperature"
                              value={editingData.temprature}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Weight</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="weight"
                              value={editingData.weight}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="record-bottom-row">
                      {patientType === "obstetrics" ? (
                        <>
                          <div className="single-records">
                            <h4>Treatment Type</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="treatment_type"
                              value={editingData.treatment_type}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Age</h4>
                            <input
                              className="input_data"
                              type="number"
                              name="age"
                              value={editingData.age}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Blood Pressure</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="blood_pressure"
                              value={editingData.blood_pressure}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="single-records">
                            <h4>Age</h4>
                            <input
                              className="input_data"
                              type="number"
                              name="age"
                              value={editingData.age}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Immune System Status</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="immune_system_status"
                              value={editingData.immune_system_status}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Heart Rate</h4>
                            <input
                              className="input_data"
                              type="number"
                              name="heart_rate"
                              value={editingData.heart_rate}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="single-records">
                            <h4>Vaccination Instructions</h4>
                            <input
                              className="input_data"
                              type="text"
                              name="vaccination_instructions"
                              value={editingData.vaccination_instructions}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <button onClick={() => onSaveClick(editingData)}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="editing-records">
                    <div className="record-top-row">
                      {patientType === "obstetrics" ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          <div className="single-records">
                            <h4>Vaccine Type</h4>
                            <p>{plan.vaccine_type}</p>
                          </div>
                          <div className="single-records">
                            <h4>Temperature</h4>
                            <p>{plan.temprature}</p>
                          </div>
                          <div className="single-records">
                            <h4>Weight</h4>
                            <p>{plan.weight}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="record-bottom-row">
                      {patientType === "obstetrics" ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          <div className="single-records">
                            <h4>Age</h4>
                            <p>{plan.age}</p>
                          </div>
                          <div className="single-records">
                            <h4>Immune System Status</h4>
                            <p>{plan.immune_system_status}</p>
                          </div>
                          <div className="single-records">
                            <h4>Heart Rate</h4>
                            <p>{plan.heart_rate}</p>
                          </div>
                          <div className="single-records">
                            <h4>Vaccination Instructions</h4>
                            <p>{plan.vaccination_instructions}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No treatment plan available.</p>
      )}
    </div>
  );
};

export default PatientDetailsTable;
