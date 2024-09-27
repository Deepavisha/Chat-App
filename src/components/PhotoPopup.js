import React from 'react';

const PhotoPopup = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        {/* Photo with a 1:1 aspect ratio */}
        <div className="w-96 h-96 bg-gray-800">
          <img 
            src={user?.photoURL} 
            alt={`${user?.displayName} Profile`} 
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* "X" Close button positioned outside the top-right corner */}
        <button 
          className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default PhotoPopup;
