import React from "react";
import "./Overview.css";
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
const API_URL = import.meta.env.VITE_API_URL;

const D_Overview = () => {
  const [doctor, setDoctor] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);
  const [todayAppointment, setTodayAppointment] = useState([]);
  const [remainingAppointment, setRemainingAppointment] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const mergedData = useContext(MergedDataContext);
  const fewRecent = recentPatients.splice(0, 4);
  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState([]);

  useEffect(() => {
    setRecentPatients(mergedData);
    setTodayAppointment(todayAppointments);
    setRemainingAppointment(remainingAppointments);
  }, [mergedData]);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();

  const fetchDoctorData = async () => {
    if (!token || !id || !role) {
      console.error("No token, id, or role found, please log in");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/doctor/`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
      });

      if (!response.ok) {
        setResp(false);
        throw new Error("Failed to fetch doctor data");
      }

      const doctorData = await response.json();
      setDoctor(doctorData);
      // console.log("Doctor data:", doctorData);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };
  const fetchDoctorStats = async () => {
    try {
      const resp = await fetch(`${API_URL}/doctor/statistics`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
      });
      if (!resp.ok) {
        throw new Error("Failed to fetch doctor stats");
      }
      const stats = await resp.json();
      setDoctorStats(stats);
      // console.log(stats);
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
      throw new Error("Failed to fetch doctor stats");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchDoctorData(), fetchDoctorStats()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (!resp) {
    return <div>Not found...</div>;
  }

  // Filter today's appointments from mergedData
  const todayz = new Date();
  todayz.setHours(0, 0, 0, 0); // Ensure today's date has no time portion

  const todayAppointments = mergedData.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0); // Ensure appointment date has no time portion
    return appointmentDate.getTime() === todayz.getTime();
  });

  const remainingAppointments = mergedData.filter((appointments) => {
    const appointmentDate = new Date(appointments.date);
    appointmentDate.setHours(0, 0, 0, 0); // Ensure appointment date has no time portion
    return appointmentDate.getTime() > todayz.getTime();
  });

  return (
    <div className="overview-page">
      {loading ? (
        <>
          <h1 className="loading1">Loading...</h1>
        </>
      ) : (
        <>
          <div className="overview-title">
            <h2>
              Welcome, Dr. {doctor.f_name} {doctor.l_name}
            </h2>
            <p>Have a nice day at work </p>
          </div>
          <div className="overview-cards">
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faCalendar} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{doctorStats.total_appointments}</h1>
                <h5>Appointments</h5>
              </div>
            </div>
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faUser} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{doctorStats.total_patients}</h1>
                <h5>Total Patient</h5>
              </div>
            </div>
            <div className="card">
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={faFaceSmile} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{doctorStats.total_reviews}</h1>
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
                <h1>{doctorStats.total_prescriptions}</h1>
                <h5>Prescription</h5>
              </div>
            </div>
          </div>
          <div className="overview-app">
            <div className="reschedule">
              <div className="reschedule-txt">
                <h3>Remaining Appointments</h3>
                <NavLink to="/appointment">
                  View All <FontAwesomeIcon icon={faChevronRight} />
                </NavLink>
              </div>
              <div className="reschedule-list">
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
              </div>
            </div>
            <div className="statistics"></div>
            <div className="today-appointments">
              <h3>Today Appointments</h3>
              <div className="today-list">
                {todayAppointment.length > 4
                  ? todayAppointment.slice(0, 4).map((appointment) => {
                      const {
                        patient_id,
                        patientName,
                        job,
                        image,
                        start_time,
                      } = appointment;
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
                      const {
                        patient_id,
                        patientName,
                        job,
                        image,
                        start_time,
                      } = appointment;
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
            </div>
          </div>

          <div className="overview-patients">
            <div className="patients-txt">
              <h3>Recent Patients</h3>
              <NavLink to="/mypatient" onClick={() => window.scrollTo(0, 0)}>
                View All <FontAwesomeIcon icon={faChevronRight} />
              </NavLink>
            </div>
            <PatientTable patients={fewRecent} />
          </div>
        </>
      )}
    </div>
  );
};

export default D_Overview;
