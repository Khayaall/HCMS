import React, { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import D_ProfileCard from "../D_ProfileCard/D_ProfileCard";
import My_Profile from "../My_Profile/My_Profile";

const ParentComponent = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    specialty: "Cardiology",
    bio: "Experienced cardiologist...",
    college: "Harvard Medical School",
    degree: "M.D.",
    image: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsModalOpen(false);  
  };

  return (
    <div>
      <D_ProfileCard 
        profile={profile}
        onEdit={() => setIsModalOpen(true)} // Open modal via D_ProfileCard
      />
      <My_Profile profile={profile} />
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onSave={handleSave}
      />
    </div>
  );
};
export default ParentComponent;