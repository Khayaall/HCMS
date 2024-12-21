import React from "react";
import "./Overview.css";
import { useState, useEffect } from "react";
import { data, patients, today_patients } from "../../Navbar/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faClipboardList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PatientTable from "../../Components/D_PatientList/PatientTable";
import recentPatients from "../../Components/D_PatientList/Patients.json";
import { NavLink } from "react-router-dom";

const D_Overview = () => {
  const [userOverview, setUserOverview] = useState(data);
  const [patient, setPatient] = useState(patients);
  const [today, setToday] = useState(today_patients);
  const [recent, setRecent] = useState(recentPatients);
  const fewRecent = recent.splice(0, 4);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      const role = localStorage.getItem('role').toLowerCase();
      if (!token || !id || !role) {
        console.error('No token, id, or role found, please log in');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/doctor/', {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`,
            'User-Id': id,
            'User-Role': role
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }

        const doctorData = await response.json();
        setDoctor(doctorData);
        console.log('Doctor data:', doctorData);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <div className="overview-page">
          <div className="overview-title">
            <h2>Welcome, Dr. {doctor.f_name} {doctor.l_name}</h2>
            <p>Have a nice day at great work </p>
          </div>
      <div className="overview-cards">
        <div className="card">
          <div className="card-logo">
            <p>
              <FontAwesomeIcon icon={faCalendar} size="2xl" />
            </p>
          </div>
          <div className="card-txt">
            <h1>10.1k</h1>
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
            <h1>5.37k</h1>
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
            <h1>2.7k</h1>
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
            <h1>24.4k</h1>
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
            {patient.map((patients) => {
              const {
                name,
                age,
                image,
                appointment_date,
                gender,
                appointment_time,
              } = patients;
              return (
                <ul>
                  <li>
                    <div className="list-img">
                      <img src={image} alt="" />
                    </div>
                    <div className="list-txt">
                      <h5>{name}</h5>
                      <p>
                        {age} {gender}, {appointment_date}
                      </p>
                    </div>
                    <div>
                      <p>{appointment_time}</p>
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
            {today.length > 4
              ? setToday(today.splice(0, 3))
              : today.map((today) => {
                  const { name, job_title, image, appointment_time } = today;
                  return (
                    <ul>
                      <li>
                        <div className="today-img">
                          <img src={image} alt="" />
                        </div>
                        <div className="today-txt">
                          <h5>{name}</h5>
                          <p>{job_title}</p>
                        </div>
                        <div>
                          <p>{appointment_time}</p>
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
    </div>
  );
};

export default D_Overview;
