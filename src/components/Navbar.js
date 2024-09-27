import React, { useContext, useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for Logout Confirmation Popup
  const { currentUser } = useContext(AuthContext);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Show the Logout confirmation popup
  const confirmLogout = () => {
    setShowLogoutPopup(true);
  };

  // Hide the Logout confirmation popup
  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  // Handle the Logout action
  const handleLogout = () => {
    signOut(auth);
    setShowLogoutPopup(false); // Close the popup after logging out
  };

  return (
    <>
      <div className="p-4 flex items-center bg-gray-900 relative">
        {/* Link to the profile page */}
        <Link to="/profile">
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full ml-3 object-cover hover:cursor-pointer"
          />
        </Link>

        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#feab01] to-[#e23c00] text-2xl font-bold ml-24">
          Chat App
        </h1>

        <div className="ml-auto relative">
          <EllipsisVerticalIcon
            onClick={toggleMenu}
            className="w-6 h-6 mr-2 text-yellow-300 cursor-pointer"
          />

          {showMenu && (
            <div className="absolute right-4 mt-2 w-32 bg-gray-700 rounded shadow-lg z-10">
              <ul>
                <li className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
                  Settings
                </li>
                <li
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer"
                  onClick={confirmLogout} // Show the confirmation popup
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-white text-center mb-4">Confirm Logout</h3>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={cancelLogout} // Close the popup without logging out
              >
                Cancel
              </button>
              <button
                className="bg-red-500 px-4 py-2 text-white rounded-md"
                onClick={handleLogout} // Proceed with logout
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;