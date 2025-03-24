import React from "react";
import "./p_overview.css";
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faClipboardList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PatientTable from "../../Components/D_PatientList/PatientTable";
import { NavLink } from "react-router-dom";
import { MergedDataContext } from "../../Components/APIs/AppointmentsWithPatients";
const API_URL = process.env.REACT_APP_API_URL;

const P_Overview = () => {
  const [patient, setPatient] = useState([]);
  const [resp, setResp] = useState([]);
  const [patientStats, setPatientStats] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [todayAppointment, setTodayAppointment] = useState([]);
  // const [remainingAppointment, setRemainingAppointment] = useState([]);
  // const [recentPatients, setRecentPatients] = useState([]);
  // const mergedData = useContext(MergedDataContext);
  // const fewRecent = recentPatients.splice(0, 4);

  // useEffect(() => {
  //   setRecentPatients(mergedData);
  //   setTodayAppointment(todayAppointments);
  //   setRemainingAppointment(remainingAppointments);
  // }, [mergedData]);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();

  const fetchPatientData = async () => {
    if (!token || !id || !role) {
      console.error("No token, id, or role found, please log in");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patient/`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const patientData = await response.json();
      setPatient(patientData);
      // console.log("Patient data:", patientData);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };
  const fetchPatientStats = async () => {
    try {
      const resp = await fetch(`${API_URL}/patient/statistics`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
      });
      if (!resp.ok) {
        setResp(false);
        throw new Error("Failed to fetch patient stats");
      }
      const stats = await resp.json();
      setPatientStats(stats);
      // console.log(stats);
    } catch (error) {
      console.error("Error fetching patient stats:", error);
      throw new Error("Failed to fetch patient stats");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchPatientData(), fetchPatientStats()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!resp) {
    return <h1 className="loading1">Not found...</h1>;
  }

  return (
    <>
      {loading ? (
        <>
          <h1 className="loading1">Loading...</h1>
        </>
      ) : (
        <div className="overview-page">
          <div className="overview-title">
            <h2>
              Welcome, Mrs. {patient.f_name} {patient.l_name}
            </h2>
            <p>Have a nice day at great work </p>
          </div>
          <div className="overview-cards">
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faUser} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{patientStats.Total_doctors}</h1>
                <h5>Doctors</h5>
              </div>
            </div>
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faCalendar} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{patientStats.Total_appointments}</h1>
                <h5>Appointments</h5>
              </div>
            </div>
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faFaceSmile} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{patientStats.Total_reviews}</h1>
                <h5>Review</h5>
              </div>
            </div>
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faClipboardList} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{patientStats.Total_ultra_images}</h1>
                <h5>Ultra Images</h5>
              </div>
            </div>
          </div>
          <div className="overview-app">
            <div className="reschedule">
              <div className="reschedule-txt">
                <h3>Recent Doctors</h3>
                <NavLink to="/patientBooking">
                  View All <FontAwesomeIcon icon={faChevronRight} />
                </NavLink>
              </div>
              {/* <div className="reschedule-list">
            {remainingAppointment.length > 7
              ? remainingAppointment.slice(0, 7).map((appointments) => {
                  const {
                    patient_id,
                    patientName,
                    date,
                    age,
                    image,
                    start_time,
                    gender,
                  } = appointments;
                  return (
                    <ul key={patient_id}>
                      <li>
                        <div className="list-img">
                          <img src={image} alt="" />
                        </div>
                        <div className="list-txt">
                          <h5>{patientName}</h5>
                          <p>
                            {age} {gender}, {date}
                          </p>
                        </div>
                        <div>
                          <p>{start_time}</p>
                        </div>
                      </li>
                    </ul>
                  );
                })
              : remainingAppointment.map((appointments) => {
                  {
                  }
                  const {
                    patient_id,
                    patientName,
                    date,
                    age,
                    image,
                    start_time,
                    gender,
                  } = appointments;
                  console.log(appointments);
                  return (
                    <ul key={patient_id}>
                      <li>
                        <div className="list-img">
                          <img src={image} alt="" />
                        </div>
                        <div className="list-txt">
                          <h5>{patientName}</h5>
                          <p>
                            {age} {gender}, {date}
                          </p>
                        </div>
                        <div>
                          <p>{start_time}</p>
                        </div>
                      </li>
                    </ul>
                  );
                })}
          </div> */}
            </div>
            <div className="statistics"></div>
            {/* <div className="today-appointments">
          <h3>Today Appointments</h3>
          <div className="today-list">
            {todayAppointment.length > 4
              ? todayAppointment.slice(0, 4).map((appointment) => {
                  const { patient_id, patientName, job, image, start_time } =
                    appointment;
                  return (
                    <ul key={patient_id}>
                      <li>
                        <div className="today-img">
                          <img src={image} alt="" />
                        </div>
                        <div className="today-txt">
                          <h5>{patientName}</h5>
                          <p>{job}</p>
                        </div>
                        <div>
                          <p>{start_time}</p>
                        </div>
                      </li>
                    </ul>
                  );
                })
              : todayAppointment.map((appointment) => {
                  const { patient_id, patientName, job, image, start_time } =
                    appointment;
                  return (
                    <ul key={patient_id}>
                      <li>
                        <div className="today-img">
                          <img src={image} alt="" />
                        </div>
                        <div className="today-txt">
                          <h5>{patientName}</h5>
                          <p>{job}</p>
                        </div>
                        <div>
                          <p>{start_time}</p>
                        </div>
                      </li>
                    </ul>
                  );
                })}
          </div>
        </div> */}
          </div>

          <div className="overview-patients">
            <div className="patients-txt">
              <h3>Appointment History</h3>
              <NavLink to="/patientApp" onClick={() => window.scrollTo(0, 0)}>
                View All <FontAwesomeIcon icon={faChevronRight} />
              </NavLink>
            </div>
            {/* <PatientTable patients={fewRecent} /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default P_Overview;
