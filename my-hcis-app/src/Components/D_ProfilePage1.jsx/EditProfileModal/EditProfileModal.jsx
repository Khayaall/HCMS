import React, { useState, useEffect } from "react";
import "./EditProfileModal.css";
import My_Profile from "../My_Profile/My_Profile";
import D_ProfileCard from "../D_ProfileCard/D_ProfileCard";

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [college, setCollege] = useState(profile.college || "");
  const [degree, setDegree] = useState(profile.degree || "");
  const [image, setImage] = useState(profile.image || "");

  const handleSave = () => {
    onSave({ firstName, lastName,specialty, bio, college, degree, image });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Profile Info</h2>

        {/* Profile Picture Upload */}
        <div className="profile-picture">
          <img
            src={image || "https://via.placeholder.com/300"}
            alt="profile"
            className="profile-img"
          />
          <div className="upload-buttons">
            <div className="instructions" onChange>
              <h4>Upload your picture</h4>
              <p>For best results, use an image at least 150px by 150px in either JPEG or PNG</p>
            </div>
            <div className="Buttons-edit">
            <button className="upload-btn">Upload</button>
            <button className="remove-btn">Remove</button>
            </div>
          </div>
        </div>

        {/* First and Last Name */}
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Last</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Speciality</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>
        </div>

        {/* Biography */}
        <div className="form-group">
          <label>Biography</label>
          <textarea
            value={bio}
            rows="3"
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Education */}
        <div className="form-row">
          <div className="form-group">
            <label>College/Institute</label>
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            >
              <option value="Dhaka Medical College">Dhaka Medical College</option>
              <option value="Harvard Medical School">Harvard Medical School</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Degree</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            >
              <option value="M.B.B.S">M.B.B.S</option>
              <option value="M.D.">M.D.</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
