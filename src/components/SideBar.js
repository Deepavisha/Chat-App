import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from '../firebase';

const SideBar = ({ onSelectChat }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const currentUserUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchChatsWithMessages = async () => {
      if (!currentUserUid) return;

      try {
        // Get all possible chat IDs where the current user is a participant
        const usersWithMessages = [];
        
        // Fetch all users from the 'users' collection
        const usersQuery = await getDocs(collection(db, 'users'));
        const users = usersQuery.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));

        // Iterate over all users to create possible chat IDs
        for (let user of users) {
          if (user.uid !== currentUserUid) {
            const chatId = [currentUserUid, user.uid].sort().join('_');
            
            // Check if there are any messages in this chat
            const messagesQuery = query(
              collection(db, 'chats', chatId, 'messages'),
              orderBy('time', 'desc'), // Order by last message
            );
            const messagesSnapshot = await getDocs(messagesQuery);

            if (!messagesSnapshot.empty) {
              // If there are messages, get the last message
              const lastMessage = messagesSnapshot.docs[0].data();
              
              // Push the user with last message info
              usersWithMessages.push({
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastMessage: lastMessage.content,
                lastMessageTime: lastMessage.time.toDate(), // Convert Firestore timestamp
                streak: lastMessage.streak || 0,
              });
            }
          }
        }

        // Sort contacts by the timestamp of the last message (descending)
        usersWithMessages.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        setContacts(usersWithMessages);
        setFilteredContacts(usersWithMessages); // Initialize filteredContacts with users who have messages
      } catch (error) {
        console.error("Error fetching chats with messages:", error);
      }
    };

    fetchChatsWithMessages();
  }, [currentUserUid]);

  const handleSearch = (users) => {
    setFilteredContacts(users.length > 0 ? users : contacts); // Show search results or fallback to all contacts
  };

  return (
    <div className='w-2/6 bg-gray-800 h-full flex flex-col'>
      <Navbar />
      <Search onSearch={handleSearch} />
      <div className="flex-1 overflow-y-auto">
        <Chats contacts={filteredContacts} onSelectChat={onSelectChat} />
      </div>
    </div>
  );
};

export default SideBar;
