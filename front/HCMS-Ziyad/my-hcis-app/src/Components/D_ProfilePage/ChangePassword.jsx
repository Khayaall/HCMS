import React from 'react';
import './ChangePassword.css';

const ChangePassword = () => {
  return (
    <div className="change-password-container">
      <div className="heading">
        <h2>Password</h2>
        <p>Please enter your current password and new password to change it.</p>
      </div>
      <div className="currentPassword">
        <label className='box'>Current Password</label>
        <input type="password" placeholder="Current Password" />
      </div>
      <div className="newPassword">
        <label className='box'>New Password</label>
        <input type="password" placeholder="New Password" />
      </div>
      <div className="confirmPassword">
        <label className='box'>Confirm Password</label>
        <input type="password" placeholder="Confirm Password" />
      </div>
    </div>
  );
};

export default ChangePassword;