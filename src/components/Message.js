import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../firebase';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteDoc, doc } from 'firebase/firestore';
import CryptoJS from 'crypto-js'; // Importing crypto-js for decryption

const secretKey = 'your-secret-key'; // The same key used for encryption

const Message = ({ message, chatId, onDeleteMessage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // State for delete confirmation
  const [isFullMessageVisible, setIsFullMessageVisible] = useState(false); // State for showing the full message
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false); // State to show "See more"

  const messageRef = useRef(null); // Reference to the message container

  const isSentByCurrentUser = message.from === auth.currentUser?.displayName;

  // Function to decrypt the message
  const decryptMessage = (encryptedMessage) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting message:', error);
      return 'Decryption error';
    }
  };

  const decryptedContent = decryptMessage(message.content); // Decrypt the message content

  const formatTimestamp = (timestamp) => {
    try {
      // Check if the timestamp exists and is a valid Firebase timestamp
      if (!timestamp || typeof timestamp.toDate !== 'function') {
        console.warn('Message missing time or invalid format:', message);
        return 'Invalid time';
      }
  
      const date = timestamp.toDate();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12; // Convert to 12-hour format
      hours = hours ? hours : 12; // The hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid time';
    }
  };  

  // UseEffect to check if content overflows and set "See more" visibility
  useEffect(() => {
    if (messageRef.current) {
      const isOverflowing = messageRef.current.scrollHeight > messageRef.current.clientHeight;
      setShouldShowSeeMore(isOverflowing);
    }
  }, [decryptedContent]);

  // Delete message from Firebase
  const deleteMessage = async () => {
    try {
      if (!message.id) {
        console.error('Message does not have a valid ID');
        return;
      }

      const messageRef = doc(db, 'chats', chatId, 'messages', message.id);
      
      // Perform delete operation
      await deleteDoc(messageRef);
      console.log(`Message with ID: ${message.id} successfully deleted`);

      // Notify parent to remove the message from UI after successful deletion
      onDeleteMessage(message.id);  // Call the parent callback to update the UI
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete the message. Please try again.');
    }
  };

  return (
    <>
      <div
        className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} items-start mb-4`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsMenuOpen(false); // Close menu if hovered away
        }}
      >
        {/* Profile Picture */}
        {!isSentByCurrentUser && (
          <img
            src={message.profilePic || '/default-profile-pic.png'}
            alt={`${message.from}'s Profile`}
            className="w-8 h-8 rounded-full mr-2 object-contain"
          />
        )}

        <div
          className={`relative p-3 rounded-lg max-w-xs overflow-hidden ${
            isSentByCurrentUser 
              ? 'bg-yellow-500 text-gray-900 rounded-tl-[8px] rounded-tr-[0px] rounded-br-[8px] rounded-bl-[8px]' 
              : 'bg-gray-700 text-gray-300 rounded-tl-[0px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px]'
          }`}
        >
          {/* Text Message */}
          {!message.fileUrl && message.content && (
            <div
              ref={messageRef}
              className={`whitespace-pre-wrap text-gray-200 text-sm ${isFullMessageVisible ? '' : 'max-h-24 overflow-hidden'}`}
            >
              {decryptedContent}
            </div>
          )}
          {shouldShowSeeMore && !isFullMessageVisible && (
            <button
              className="text-blue-500 hover:underline mt-2"
              onClick={() => setIsFullMessageVisible(true)}
            >
              See more
            </button>
          )}

          {/* Timestamp */}
          <span className={`text-xs ${isSentByCurrentUser ? 'text-gray-100' : 'text-gray-400'}`}>
            {formatTimestamp(message.time)}
          </span>

          {/* Three dots menu (shown on hover) */}
          {isHovered && isSentByCurrentUser && (
            <div className="absolute top-0 right-0 mt-1 mr-2">
              <EllipsisHorizontalIcon
                className="w-5 h-5 text-gray-800 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-gray-800 text-white rounded-md shadow-lg">
                  <button
                    className="flex items-center px-3 py-2 w-full hover:bg-red-600 rounded-md"
                    onClick={() => setIsDeleteConfirmOpen(true)} // Open confirmation modal
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current user's profile picture */}
        {isSentByCurrentUser && (
          <img
            src={message.profilePic || '/default-profile-pic.png'}
            alt="Your Profile"
            className="w-8 h-8 rounded-full ml-2 object-contain"
          />
        )}
      </div>

      {/* Confirmation Popup for deletion */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this message?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md mr-2 hover:bg-gray-400"
                onClick={() => setIsDeleteConfirmOpen(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={async () => {
                  await deleteMessage();
                  setIsDeleteConfirmOpen(false); // Close modal after deletion
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;