import React, { useState, useEffect } from 'react';
import Chats from './Chats';
import Chat from './Chat';
import Search from './Search';
import { db } from '../firebase'; // Adjust the path based on your project structure
import { collection, getDocs } from 'firebase/firestore';

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [contacts, setContacts] = useState([]);

  // Fetch all users initially
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContacts(users); // Set initial users
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // This function will handle the search results
  const handleSearchResults = (users) => {
    console.log("Search results received in ChatApp:", users);
    setContacts(users); // Update contacts with the search results
  };

  const handleSelectChat = (contact) => {
    setSelectedChat(contact); // Set selected chat
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/6 bg-gray-800">
        {/* Pass the handleSearchResults to Search component */}
        <Search onSearch={handleSearchResults} />
        {/* Pass the updated contacts array to Chats */}
        <Chats contacts={contacts} onSelectChat={handleSelectChat} />
      </div>
      <div className="flex-1">
        {selectedChat ? (
          <Chat selectedChat={selectedChat} />
        ) : (
          <div className="text-gray-500 text-center mt-4">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
