import React, { useState, useEffect } from "react";
import "./EditProfileModal.css";
import Compressor from "compressorjs";
const API_URL = import.meta.env.VITE_API_URL;

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [college, setCollege] = useState(profile.college || "");
  const [degree, setDegree] = useState(profile.degree || "");
  const [image, setImage] = useState(profile.image || "");
  const [isUpdated, setIsUpdated] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6, // Adjust the quality as needed
        success(result) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImage(e.target.result);
          };
          reader.readAsDataURL(result);
        },
        error(err) {
          console.error("Error compressing the image:", err);
        },
      });
    }
  };

  const updatedProfile = {
    f_name: firstName,
    l_name: lastName,
    specialty,
    about_me: bio || profile.bio,
    education: `${college}, ${degree}`,
  };
  const updatedImage = {
    image_url: image,
  };
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role").toLowerCase();

  const handleSave = async () => {
    if (!token || !id || !role) {
      console.error("No token, id, or role found, please log in");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/doctor/edit_profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        onSave(updatedProfile);
        setIsUpdated(true);
        onClose();
      } else {
        console.error(
          "Failed to update profile",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
    }
  };

  const handleUploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await fetch(`${API_URL}/doctor/upload_image`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "User-Id": id,
          "User-Role": role,
        },
        body: formData,
      });

      if (response.ok) {
        onSave(updatedImage);
        setIsUpdated(true);
        onClose();
      } else {
        console.error(
          "Failed to update image",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("An error occurred while updating the image:", error);
    }
  };

  useEffect(() => {
    if (isUpdated) {
      window.location.reload();
    }
  }, [isUpdated]);

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
          <label htmlFor="file-input" className="profile-img-label">
            <img
              src={image || "https://via.placeholder.com/300"}
              alt="profile"
              className="profile-imge"
            />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="upload-buttons">
            <div className="instructions">
              <h4>Upload your picture</h4>
              <p>
                For best results, use an image at least 150px by 150px in either
                JPEG or PNG
              </p>
            </div>
            <div className="buttons-edit">
              <label htmlFor="file-input" className="upload-btn">
                Upload
              </label>
              <button
                className="remove-btn"
                onClick={() => {
                  setImage(""); // Set image to empty string when removed
                }}
              >
                Remove
              </button>
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
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Specialty</label>
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
              <option value="Dhaka Medical College">
                Dhaka Medical College
              </option>
              <option value="Harvard Medical School">
                Harvard Medical School
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Degree</label>
            <select value={degree} onChange={(e) => setDegree(e.target.value)}>
              <option value="M.B.B.S">M.B.B.S</option>
              <option value="M.D.">M.D.</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={async () => {
              await handleSave();
              await handleUploadImage();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
