import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { ArrowDownTrayIcon, EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteDoc, doc } from 'firebase/firestore';

const Message = ({ message, chatId, onDeleteMessage }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isSentByCurrentUser = message.from === auth.currentUser?.displayName;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString();
  };

  // Handle image click to preview full size
  const handleImageClick = (url) => {
    setSelectedImage(url);
    setIsImageOpen(true);
  };

  // Close the image modal
  const closeModal = () => {
    setIsImageOpen(false);
    setSelectedImage('');
  };

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
          className={`relative p-3 rounded-lg max-w-xs ${isSentByCurrentUser 
            ? 'bg-yellow-500 text-gray-900 rounded-tl-[8px] rounded-tr-[0px] rounded-br-[8px] rounded-bl-[8px]' 
            : 'bg-gray-700 text-gray-300 rounded-tl-[0px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px]'}`}
        >
          {/* File preview (image or document) */}
          {message.fileUrl && (
            <div className="mt-2 flex flex-col items-start">
              {message.fileType === 'image' ? (
                <>
                  <img
                    src={message.fileUrl}
                    alt={message.fileName || 'Image'}
                    className="max-w-full h-auto rounded-lg cursor-pointer mb-2"
                    onClick={() => handleImageClick(message.fileUrl)}
                  />
                  {message.content && (
                    <p className="whitespace-pre-wrap text-gray-900 text-sm">{message.content}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{message.fileName || 'Unnamed File'}</span>
                  <a 
                    href={message.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    download={message.fileName || 'Unnamed File'}
                  >
                    <ArrowDownTrayIcon className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Text Message */}
          {!message.fileUrl && message.content && (
            <p className="whitespace-pre-wrap">{message.content}</p>
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
                    onClick={deleteMessage}  // Call deleteMessage on click
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

      {/* Image Modal for preview */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <button
            className="text-white text-4xl absolute top-4 right-4"
            onClick={closeModal}
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Full-size preview"
            className="rounded-lg"
            style={{
              maxWidth: '80vw',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  );
};

export default Message;
