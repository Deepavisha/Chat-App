import React from 'react';
import { auth } from '../firebase';

const Chats = ({ contacts = [], onSelectChat }) => {
  const currentUserUid = auth.currentUser?.uid;

  const handleChatSelection = (contact) => {
    onSelectChat(contact); // Trigger chat selection
  };

  // Function to format the last message time (12-hour format with AM/PM)
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
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
            <div>
              <h2 className="text-yellow-500 font-bold">{contact.displayName}</h2>
              <p className="text-gray-300">{contact.lastMessage || 'No messages yet'}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              {/* Display the streak count and star icon */}
              {contact.streak > 0 && (
                <>
                  <span className="text-gray-300 text-sm">{contact.streak}</span>
                  <img src='star.png' className='h-4 w-4' alt='Star Icon' />
                </>
              )}
              {/* Display last message time */}
              <span className="text-gray-400 text-sm">{contact.lastMessageTime ? formatTime(new Date(contact.lastMessageTime)) : ''}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No chats available</div>
      )}
    </div>
  );
};

export default Chats;
