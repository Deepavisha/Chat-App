import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../firebase';
import { EllipsisHorizontalIcon, TrashIcon} from '@heroicons/react/24/outline';
import { deleteDoc, doc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import { FaDownload } from "react-icons/fa";

const secretKey = 'your-secret-key';

const Message = ({ message, chatId, onDeleteMessage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isFullMessageVisible, setIsFullMessageVisible] = useState(false);
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const messageRef = useRef(null);
  const isSentByCurrentUser = message.from === auth.currentUser?.displayName;

  const decryptMessage = (encryptedMessage) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting message:', error);
      return 'Decryption error';
    }
  };

  const decryptedContent = decryptMessage(message.content);

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp || typeof timestamp.toDate !== 'function') {
        return 'Invalid time';
      }

      const date = timestamp.toDate();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid time';
    }
  };

  useEffect(() => {
    if (messageRef.current) {
      const isOverflowing = messageRef.current.scrollHeight > messageRef.current.clientHeight;
      setShouldShowSeeMore(isOverflowing);
    }
  }, [decryptedContent]);

  const deleteMessage = async () => {
    try {
      if (!message.id) {
        console.error('Message does not have a valid ID');
        return;
      }

      const messageRef = doc(db, 'chats', chatId, 'messages', message.id);
      await deleteDoc(messageRef);
      onDeleteMessage(message.id);
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
          setIsMenuOpen(false);
        }}
      >
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
          {message.fileUrl && message.fileType === 'image' ? (
            <div onClick={() => setIsImageModalOpen(true)} className="cursor-pointer">
              <img
                src={message.fileUrl}
                alt="Sent"
                className="w-full h-auto rounded-md"
              />
            </div>
          ) : message.fileUrl && message.fileType === 'document' ? (
            <div className="flex items-start">
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {message.fileName}
              </a>
              <button
                onClick={() => window.open(message.fileUrl, '_blank')}
                className=" bg-yellow-500 text-white px-3 py-1  "
                download={message.fileName}
              >
                <FaDownload />
              </button>
            </div>
          ) : (
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

          <span className={`text-xs ${isSentByCurrentUser ? 'text-gray-100' : 'text-gray-400'}`}>
            {formatTimestamp(message.time)}
          </span>

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
                    onClick={() => setIsDeleteConfirmOpen(true)}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isSentByCurrentUser && (
          <img
            src={message.profilePic || '/default-profile-pic.png'}
            alt="Your Profile"
            className="w-8 h-8 rounded-full ml-2 object-contain"
          />
        )}
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this message?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md mr-2 hover:bg-gray-400"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={async () => {
                  await deleteMessage();
                  setIsDeleteConfirmOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-lg mx-4 relative">
            <img
              src={message.fileUrl}
              alt="Preview"
              className="w-full h-auto mb-2 rounded-md"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-0 right-0 m-4 text-white bg-gray-600 rounded-full p-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
