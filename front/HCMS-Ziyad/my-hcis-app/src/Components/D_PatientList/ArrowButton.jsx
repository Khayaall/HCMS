import React from 'react';

const ArrowButton = ({ direction, onClick }) => {
  return (
    <button className='arrow-button' onClick={onClick}>
      {direction === 'left' ? '<' : '>'}
    </button>
  );
};

export default ArrowButton;