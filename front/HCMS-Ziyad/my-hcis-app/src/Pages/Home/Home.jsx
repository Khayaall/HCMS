import React from "react";
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./home.css";
import img from "../../assets/home-img1.jpg";
import Clinic_logo3 from "../../assets/Clinic_logo3.png";
import StatisticsCards from "../../Components/Statistics/StatisticsCards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight, faMinus } from "@fortawesome/free-solid-svg-icons";
import { stats } from "../../Components/Statistics/stats";

const Home = () => {
  const [data, setData] = useState(stats);
  const statisticsRef = useRef(null);

  const scrollToStatistics = () => {
    statisticsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="home">
      <div className="home-background">
        <div className="top-background">
          <div className="side-bar">
            <div className="home-logo">
              <div className="logo-img">
                <img src={Clinic_logo3} />
              </div>
              <div className="logo-text">
                <h2>Doct.</h2>
              </div>
            </div>
            <div className="home-links">
              <ul className="home-links-list">
                <li className="home-link">
                  <NavLink to="#" onClick={scrollToStatistics}>
                    <FontAwesomeIcon icon={faMinus} />
                    <p>About</p>
                  </NavLink>
                </li>
                <li className="home-link">
                  <NavLink to="#">
                    <FontAwesomeIcon icon={faMinus} />
                    <p>Services</p>
                  </NavLink>
                </li>
                <li className="home-link">
                  <NavLink to="#">
                    <FontAwesomeIcon icon={faMinus} />
                    <p>Testimonials</p>
                  </NavLink>
                </li>
                <li className="home-link">
                  <NavLink to="#">
                    <FontAwesomeIcon icon={faMinus} />
                    <p>Vaccines</p>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <NavLink to="#">Contact Us</NavLink>
          </div>
        </div>
        <div className="bottom-background">
          <div className="large-txt">
            <span>Loving care for your family newborn members</span>
          </div>
          <div className="clear-cards">
            <div className="Glassmorphism-card">
              <p>Make an appointment</p>
              <NavLink to="/login">
                <FontAwesomeIcon icon={faCircleArrowRight} size="2xl" />
              </NavLink>
            </div>
            <div className="Glassmorphism-card">
              <p>Call a doctor at home</p>
              <NavLink to="#">
                <FontAwesomeIcon icon={faCircleArrowRight} size="2xl" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="home-statistics" ref={statisticsRef}>
        <StatisticsCards statsz={data} />
      </div>
    </div>
  );
};

export default Home;
