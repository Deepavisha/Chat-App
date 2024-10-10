import React, { useState, useRef, useEffect } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const ChatNavBar = ({ user, showUserDetails, clearChat }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [showClearChatPopup, setShowClearChatPopup] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const showPhotoPopup = () => {
    setIsPhotoOpen(true);
  };

  const closePhotoPopup = () => {
    setIsPhotoOpen(false);
  };

  const confirmClearChat = () => {
    setShowClearChatPopup(true);
  };

  const cancelClearChat = () => {
    setShowClearChatPopup(false);
  };

  const handleClearChat = () => {
    clearChat();
    setShowClearChatPopup(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <div className="p-4 flex items-center bg-gray-800 border-b border-gray-700">
        <img 
          src={user?.photoURL} 
          alt={`${user?.displayName} Profile`} 
          className="w-10 h-10 rounded-full mr-4 object-cover hover:cursor-pointer"
          onClick={showPhotoPopup}
        />
        <h2 
          className="text-yellow-300 text-xl font-bold hover:cursor-pointer"
          onClick={showUserDetails}
        >
          {user?.displayName}
        </h2>
        <div className="ml-auto relative" ref={menuRef}>
          <EllipsisVerticalIcon 
            onClick={toggleMenu} 
            className="w-6 h-6 mr-2 text-yellow-300 cursor-pointer" 
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleMenu()} // Handle enter key
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

      {showClearChatPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={cancelClearChat} // Close on backdrop click
        >
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-80" onClick={e => e.stopPropagation()}>
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

      {isPhotoOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closePhotoPopup}
        >
          <div className="relative">
            <button
              aria-label="Close photo popup"
              className="absolute top-[-35px] right-[-35px] text-white text-4xl"
              onClick={closePhotoPopup}
            >
              &times;
            </button>
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
