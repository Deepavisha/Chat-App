import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const UserDetails = ({ user, onClose }) => {
  return (
    <div className="relative flex flex-col justify-center items-center h-full bg-gray-900 text-gray-300">
      
      {/* Left arrow button positioned at the top left */}
      <button 
        className="absolute top-4 left-4 p-2 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 focus:outline-none"
        onClick={onClose}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>

      {/* User profile information */}
      <img 
        src={user?.photoURL} 
        alt={`${user?.displayName} Profile`} 
        className="w-60 h-60 rounded-full mb-12 object-cover"
      />
      <h2 className="text-yellow-300 text-2xl font-bold">Name: {user?.displayName}</h2>
      <p className="text-gray-400 mt-2">Email: {user?.email}</p>
    </div>
  );
};

export default UserDetails;
