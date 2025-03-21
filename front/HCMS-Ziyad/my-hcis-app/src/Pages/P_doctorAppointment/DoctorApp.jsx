import React from "react";
import "./doctorApp.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faMessage,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DoctorApp = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState({});
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [click, setClick] = useState(false);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/patient/doctor/${doctorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            "User-Id": id,
            "User-Role": role,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDoctor(data);
        console.log("Doctor:", data);
      } else {
        console.error("Failed to fetch doctor");
        setResp(false);
      }
    } catch (error) {
      console.error("Failed to fetch doctor");
    }
  };

  useEffect(() => {
    const fetchWait = async () => {
      await Promise.all([fetchDoctor()]);
      setLoading(false);
    };
    fetchWait();
  }, []);

  const handleMailTo = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleTel = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  //   const handleDateChange = (e) => {
  //     const date = new Date(e.target.value);
  //     setSelectedDate(date);
  //     const days = [];
  //     const year = date.getFullYear();
  //     const month = date.getMonth();
  //     const daysInMonth = new Date(year, month + 1, 0).getDate();
  //     for (let i = 1; i <= daysInMonth; i++) {
  //       days.push(new Date(year, month, i));
  //     }
  //     setDaysInMonth(days);
  //     setAvailableTimes([
  //       "09:00 AM",
  //       "10:00 AM",
  //       "11:00 AM",
  //       "01:00 PM",
  //       "02:00 PM",
  //       "03:00 PM",
  //     ]);
  //   };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    setDaysInMonth(days);
    setAvailableTimes([
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
      "07:00 PM",
      "08:00 PM",
      "09:00 PM",
    ]);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setClick(true);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = () => {
    alert(
      `Appointment booked for ${selectedDate.toDateString()} at ${selectedTime}`
    );
  };

  if (!resp) return <h1 className="loading1">Doctor not found</h1>;

  return (
    <>
      {loading ? (
        <h1 className="loading1">Loading...</h1>
      ) : (
        <div className="dr-info">
          {/* <h1>hello there {doctor.f_name}</h1> */}
          <div className="dr-data-left">
            <div className="dr-data-img">
              <img src={doctor.image_url} alt="doctor" />
            </div>
            <div className="dr-data-info">
              <h3>
                Dr. {doctor.f_name} {doctor.l_name}
              </h3>
              <p>{doctor.specialty}</p>
            </div>
            <div className="dr-data-icons">
              <div className="dr-data-icons-msg">
                <button
                  className="dr-buttons"
                  onClick={() => handleMailTo(doctor.email)}
                >
                  <FontAwesomeIcon icon={faMessage} />
                </button>
              </div>
              <div className="dr-data-icons-msg">
                <button
                  className="dr-buttons"
                  onClick={() => handleTel(doctor.phone)}
                >
                  <FontAwesomeIcon icon={faPhoneVolume} />
                </button>
              </div>
              <div className="dr-data-icons-msg">
                <button
                  className="dr-buttons"
                  onClick={() => handleMailTo(doctor.email)}
                >
                  <FontAwesomeIcon icon={faMessage} />
                </button>
              </div>
            </div>
            <div className="dr-data-about">
              <h3>Biography</h3>
              <div className="dr-data-bio">
                <p>
                  Dr. {doctor.f_name} {doctor.l_name} is a {doctor.about_me}
                  <span
                    onClick={() => setReadMore(!readMore)}
                    style={{ cursor: "pointer", color: "var(--blue)" }}
                  >
                    {readMore ? " " : " Read more"}
                  </span>
                  {readMore && (
                    <span>with {doctor.experience} experience.</span>
                  )}
                  <span
                    onClick={() => setReadMore(!readMore)}
                    style={{ cursor: "pointer", color: "var(--blue)" }}
                  >
                    {readMore ? " Read less" : ""}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="dr-data-right">
            <div className="dr-data-loc">
              <h3>Location</h3>
              <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      doctor.address
                    )}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
                    frameBorder="0"
                    scrolling="no"
                    style={{ width: "710px", height: "360px" }}
                    allowFullScreen
                  ></iframe>
                  <style>
                    {`
                  .mapouter {
                    display: table;
                  }
                  .gmap_canvas {
                    overflow: hidden;
                    position: relative;
                    height: 360px;
                    width: 710px;
                    background: #fff;
                  }
                  .gmap_canvas iframe {
                    position: relative !important;
                    z-index: 2 !important;
                  }
                  .gmap_canvas a {
                    color: #fff !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    z-index: 0 !important;
                  }
                `}
                  </style>
                </div>
              </div>
            </div>
            <div className="dr-data-regis">
              <h3>Booking</h3>
              <div className="dr-data-booking">
                <div className="booking-container">
                  <div className="booking-bar">
                    <h3>Choose date and time</h3>
                    <div
                      onClick={() => setClick(false)}
                      className="booking-bar-calender"
                    >
                      <FontAwesomeIcon icon={faCalendarDays} />
                      <DatePicker
                        onChange={handleDateChange}
                        selected={selectedDate}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        customInput={<input type="text" />}
                        placeholderText="Select a date"
                      />
                      {/* <input type="date" onChange={handleDateChange} /> */}
                    </div>
                  </div>
                  <div className="booking-date-container">
                    <div className="booking-date">
                      {daysInMonth.map((day) => (
                        <button
                          key={day}
                          className="booking-date-item"
                          style={{
                            background:
                              selectedDate &&
                              selectedDate.getTime() === day.getTime()
                                ? "var(--purple)"
                                : "none",
                          }}
                          onClick={() => handleDayClick(day)}
                        >
                          <p>
                            {day.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </p>
                          <p>{day.getDate()}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  {click && (
                    <div className="booking-time">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeClick(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="booking-submit">
                    {selectedDate && selectedTime && click && (
                      <div className="booking-submit-container">
                        {/* <p>
                          Appointment on {selectedDate.toDateString()} at{" "}
                          {selectedTime}
                        </p> */}
                        <p>
                          {selectedDate.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          | {selectedTime}
                        </p>
                        <button onClick={handleSubmit}>Book</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DoctorApp;
