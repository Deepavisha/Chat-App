import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import CryptoJS from 'crypto-js';

const Chats = ({ contacts = [], onSelectChat }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Function to decrypt the message content
  const decryptMessage = (encryptedMessage) => {
    const secretKey = 'your-secret-key'; // Make sure to use the same key used for encryption
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting message:', error);
      return 'Decryption error';
    }
  };

  // Function to format the last message time (12-hour format with AM/PM)
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Handle selecting a chat
  const handleChatSelection = (contact) => {
    onSelectChat(contact);
  };

  // Function to handle the button click for showing the search popup
  const handleAddClick = () => {
    setShowPopup(true);
  };

  // Function to close the search popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSearchTerm('');
    setSuggestedUsers([]);
  };

  // Function to fetch users based on search term from Firestore
  const fetchSuggestedUsers = async (searchValue) => {
    if (!searchValue) {
      setSuggestedUsers([]);
      return;
    }
    try {
      const usersRef = collection(db, 'users');
      const searchQuery = query(
        usersRef,
        where('email', '>=', searchValue),
        where('email', '<=', searchValue + '\uf8ff')
      );
      const snapshot = await getDocs(searchQuery);
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Get the current user's email
      const currentUserEmail = auth.currentUser?.email;

      // Filter out the current user from the suggested users
      const filteredUsers = users.filter(user => user.email !== currentUserEmail);

      setSuggestedUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle typing in the search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchSuggestedUsers(value);
  };

  // Function to handle selecting a user from the search results
  const handleSelectUser = (user) => {
    onSelectChat(user);
    setShowPopup(false);
    setSearchTerm('');
    setSuggestedUsers([]);
  };

  return (
    <div className="relative h-full">
      {/* Scrollable Chats List */}
      <div className="overflow-y-auto h-full">
        {contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-700 ml-2 cursor-pointer"
              onClick={() => handleChatSelection(contact)}
            >
              <img
                src={contact.photoURL || '/default-profile-pic.png'}
                alt={`${contact.displayName} Profile`}
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <div className="flex-1">
                <h2 className="text-yellow-500 font-bold">{contact.displayName}</h2>
                <p
                  className="text-gray-300 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ maxWidth: '200px' }} // Adjust the maxWidth as needed
                  title={contact.lastMessage ? decryptMessage(contact.lastMessage) : 'No messages yet'}
                >
                  {contact.lastMessage ? decryptMessage(contact.lastMessage) : 'No messages yet'}
                </p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                {contact.streak > 0 && (
                  <>
                    <span className="text-gray-300 text-sm">{contact.streak}</span>
                    <img src="star.png" className="h-4 w-4" alt="Star Icon" />
                  </>
                )}
                <span className="text-gray-400 text-sm">
                  {contact.lastMessageTime ? formatTime(new Date(contact.lastMessageTime)) : ''}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center mt-40">No chats available</div>
        )}
      </div>

      {/* Floating Button at the bottom right, outside the scrollable content */}
      <button
        onClick={handleAddClick}
        className="absolute bottom-6 right-6 bg-yellow-500 text-white rounded-full p-4 shadow-lg"
      >
        <img src="add.png" alt="Add Chat" className="w-6 h-6" />
      </button>

      {/* Search Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-white text-xl mb-4">Search Users</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInput}
              placeholder="Search Users by Username"
              className="w-full p-2 mb-4 text-black rounded"
            />
            {suggestedUsers.length > 0 && (
              <div className="max-h-48 overflow-y-auto bg-gray-700 rounded-lg">
                {suggestedUsers.map((user) => (
                  <div
                    key={user.uid}
                    className="p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <p className="text-yellow-500">{user.username}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleClosePopup}
              className="bg-red-500 text-white p-2 rounded w-full mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;
