import React, { useState } from "react";
import "./EditProfileModal.css";

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [img, setImg] = useState(profile.img);
  const [specialty, setSpecialty] = useState(profile.specialty);
  const [ratings, setRatings] = useState(profile.ratings);
  const [trust, setTrust] = useState(profile.trust);

  const handleSave = () => {
    onSave({ name, img, specialty, ratings, trust });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Image URL:
          <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
        </label>
        <label>
          Specialty:
          <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        </label>
        <label>
          Ratings:
          <input type="number" value={ratings} onChange={(e) => setRatings(e.target.value)} />
        </label>
        <label>
          Trust:
          <input type="number" value={trust} onChange={(e) => setTrust(e.target.value)} />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditProfileModal;