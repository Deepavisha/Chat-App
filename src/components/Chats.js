import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const Chats = ({ contacts = [], onSelectChat }) => {
  const currentUserUid = auth.currentUser?.uid;
  const [sortedContacts, setSortedContacts] = useState([]);

  useEffect(() => {
    if (Array.isArray(contacts)) {
      const sorted = contacts
        .filter(contact => contact.uid !== currentUserUid) // Exclude current user from list
        .sort((a, b) => {
          const aTimestamp = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
          const bTimestamp = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;

          return bTimestamp - aTimestamp; // Sort by the timestamp of the last message
        });

      setSortedContacts(sorted); // Update state with sorted contacts
    }
  }, [contacts, currentUserUid]);

  const handleChatSelection = (contact) => {
    onSelectChat(contact); // Trigger chat selection
  };

  return (
    <div className="overflow-y-auto h-full">
      {sortedContacts.length > 0 ? (
        sortedContacts.map((contact, index) => (
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
              <p className="text-gray-300">{contact.lastMessage?.text || 'No messages yet'}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-gray-300 text-sm">{contact.streak || '0'}</span>
              <img src='star.png' className='h-4 w-4' alt='Star Icon' />
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