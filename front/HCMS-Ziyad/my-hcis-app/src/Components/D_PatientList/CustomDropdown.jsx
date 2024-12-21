import React from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ number, setNumber }) => {
  const handleIncrease = () => {
    setNumber(number + 1);
  };

  const handleDecrease = () => {
    if (number > 1) 
      setNumber(number - 1);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      setNumber('');
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        setNumber(parsedValue);
      }
    }
  };

  const handleBlur = () => {
    if (number === '') {
      setNumber(1); // Set a default value if the input is empty
    }
  };

  return (
    <div className="spinner-container">
      <input
        type="text"
        className="spinner-input"
        value={number}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="arrows-container">
        <button className="arrow up" onClick={handleIncrease}>
          ▲
        </button>
        <button className="arrow down" onClick={handleDecrease}>
          ▼
        </button>
      </div>
    </div>
  );
};

export default CustomDropdown;