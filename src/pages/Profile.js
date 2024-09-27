import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import necessary icons

const Profile = () => {
  const { currentUser } = useContext(AuthContext); // Get the current user from AuthContext
  const navigate = useNavigate(); // Use for navigation

  // State to handle the "About" section
  const [about, setAbout] = useState("Hey Guys,I am using Chat App!");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Toggle editing for name and email
  const toggleEditingName = () => setIsEditingName(!isEditingName);
  const toggleEditingEmail = () => setIsEditingEmail(!isEditingEmail);

  // Navigate back to the chat (home) page
  const goBack = () => navigate('/');

  return (
    <div className="p-4 bg-gray-800 text-gray-200 h-screen relative">
      {/* Back arrow icon */}
      <ArrowLeftIcon
        onClick={goBack}
        className="absolute top-4 left-4 w-8 h-8 text-yellow-500 cursor-pointer"
      />

      {/* Title centered at the top */}
      <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#feab01] to-[#e23c00]">User Info</h1>

      <div className="flex flex-col md:flex-row justify-center items-start">
        {/* Left Side - Profile Picture */}
        <div className="md:w-2/4 flex justify-center mt-12 border-r border-yellow-500">
          <img
            src={currentUser?.photoURL || '/default-profile-pic.png'}
            alt="Profile"
            className="w-80 h-80 rounded-full object-cover"
          />
        </div>

        {/* Right Side - User Details */}
        <div className="md:w-2/4 pl-8 mt-32 ml-10">
          {/* Name Section */}
          <div
            className="flex items-center mb-4 group"
            onMouseEnter={toggleEditingName}
            onMouseLeave={toggleEditingName}
          >
            <h2 className="text-xl font-bold">Name  : {currentUser?.displayName || 'User Name'}</h2>
            {isEditingName && (
              <PencilIcon
                className="ml-2 w-6 h-6 text-yellow-500 cursor-pointer"
                onClick={() => alert('Edit Name functionality here')}
              />
            )}
          </div>

          {/* Email Section */}
          <div
            className="flex items-center mb-4 group"
            onMouseEnter={toggleEditingEmail}
            onMouseLeave={toggleEditingEmail}
          >
            <p className="text-xl"><strong>Email  :</strong> {currentUser?.email}</p>
            {isEditingEmail && (
              <PencilIcon
                className="ml-2 w-6 h-6 text-yellow-500 cursor-pointer"
                onClick={() => alert('Edit Email functionality here')}
              />
            )}
          </div>

          {/* About Section */}
          <div className="mt-4">

            <h3 className="text-xl font-semibold mb-2 text-gray-300">About  :  <span className='text-lg text-gray-100'>{about}</span></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
