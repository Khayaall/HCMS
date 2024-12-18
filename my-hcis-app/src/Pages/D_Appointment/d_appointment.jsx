import React, { useState } from 'react';
import './d_appointment.css';
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import ArrowButton from "../../Components/D_PatientList/ArrowButton";
import PatientList from "../../Components/D_PatientList/patientListCard";
import PatientGrid from "../../Components/D_PatientList/patientGridCard"

const D_Appointment = () => {
  const [date, setDate] = useState(new Date('2023-09-20'));
  const [layout, setLayout] = useState('grid'); // State to manage layout type

  const handleDateChange = (days) => {
    setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + days)));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleLayout = (layoutType) => {
    setLayout(layoutType);
  };

  return (
    <div className='appointment-container'>
      <div className='appointment-header'>
        <h2>Appointment</h2>
        <p><span className='bold-white'>Showing:</span> All upcoming patients</p>
      </div>
      <div className='layout-toggle-buttons'>
        <button 
          className={`layout-button ${layout === 'list' ? 'active' : ''}`} 
          onClick={() => toggleLayout('list')}
        >
          List
        </button>
        <button 
          className={`layout-button ${layout === 'grid' ? 'active' : ''}`} 
          onClick={() => toggleLayout('grid')}
        >
          Grid
        </button>
      </div>
      <div className='appointment-controls'>
        <div className='date-controls'>
          <span className='date-display'>{formatDate(date)}</span>
          <ArrowButton direction='left' onClick={() => handleDateChange(-1)} />
          <ArrowButton direction='right' onClick={() => handleDateChange(1)} />
        </div>
        <div className='filter-dropdown-container'>
          <FilterDropdown className='filter-dropdown-left' />
        </div>
      </div>
      {layout === 'list' && (
        <div className='cards-container list'>
          <PatientList />
        </div>
      )}
      {layout === 'grid' && (
        <div className='cards-container grid'>
          <PatientGrid />
        </div>
      )}
    </div>
  );
};

export default D_Appointment;