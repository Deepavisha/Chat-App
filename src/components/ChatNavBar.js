import React, { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const ChatNavBar = ({ user, showUserDetails, clearChat }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false); // Manage photo popup state
  const [showClearChatPopup, setShowClearChatPopup] = useState(false); // New state for the clear chat confirmation popup

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  // Function to open the photo popup
  const showPhotoPopup = () => {
    setIsPhotoOpen(true);
  };

  // Function to close the photo popup
  const closePhotoPopup = () => {
    setIsPhotoOpen(false);
  };

  // Function to handle Clear Chat confirmation
  const confirmClearChat = () => {
    setShowClearChatPopup(true);
  };

  const cancelClearChat = () => {
    setShowClearChatPopup(false);
  };

  const handleClearChat = () => {
    clearChat(); // Call the clearChat function passed via props
    setShowClearChatPopup(false);
  };

  return (
    <>
      <div className="p-4 flex items-center bg-gray-800 border-b border-gray-700">
        {/* Profile image click opens the photo popup */}
        <img 
          src={user?.photoURL} 
          alt={`${user?.displayName} Profile`} 
          className="w-10 h-10 rounded-full mr-4 object-cover hover:cursor-pointer"
          onClick={showPhotoPopup}
        />
        {/* Clicking on the user name shows user details */}
        <h2 
          className="text-yellow-300 text-xl font-bold hover:cursor-pointer"
          onClick={showUserDetails}
        >
          {user?.displayName}
        </h2>
        <div className="ml-auto relative">
          <EllipsisVerticalIcon 
            onClick={toggleMenu} 
            className="w-6 h-6 mr-2 text-yellow-300 cursor-pointer" 
          />
          {showMenu && (
            <div className="absolute right-4 mt-2 w-32 bg-gray-700 rounded shadow-lg z-10">
              <ul>
                <li 
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer"
                  onClick={confirmClearChat}
                >
                  Clear Chat
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearChatPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        >
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-white text-center mb-4">Confirm Clear Chat</h3>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={cancelClearChat}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 px-4 py-2 text-white rounded-md"
                onClick={handleClearChat}
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {isPhotoOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closePhotoPopup} // Close modal on clicking the background
        >
          {/* Modal container for the image and button */}
          <div className="relative">
            {/* Close button positioned outside top-right of the image */}
            <button
              className="absolute top-[-35px] right-[-35px] text-white text-4xl"
              onClick={closePhotoPopup}
            >
              &times;
            </button>
            {/* Profile Picture Display */}
            <img 
              src={user?.photoURL} 
              alt={`${user?.displayName} Profile`} 
              className="w-80 h-80 object-cover" 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatNavBar;
