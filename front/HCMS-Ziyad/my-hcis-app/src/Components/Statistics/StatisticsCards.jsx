import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./statisticscards.css";

const StatisticsCards = ({ statsz }) => {
  return (
    <div className="statistic-container">
      <div className="statistic-card">
        {statsz.map((stat) => {
          const { id, icon, value, title } = stat;
          return (
            <div className="card" key={id}>
              <div className="card-logo">
                <p>
                  <FontAwesomeIcon icon={icon} size="2xl" />
                </p>
              </div>
              <div className="card-txt">
                <h1>{value}</h1>
                <h5>{title}</h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsCards;
