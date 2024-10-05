import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from '../firebase';

const SideBar = ({ onSelectChat }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const currentUserUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchChatsWithMessages = async () => {
      if (!currentUserUid) return;

      try {
        const usersWithMessages = [];
        
        const usersQuery = await getDocs(collection(db, 'users'));
        const users = usersQuery.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));

        for (let user of users) {
          if (user.uid !== currentUserUid) {
            const chatId = [currentUserUid, user.uid].sort().join('_');
            
            const messagesQuery = query(
              collection(db, 'chats', chatId, 'messages'),
              orderBy('time', 'desc'),
            );
            const messagesSnapshot = await getDocs(messagesQuery);

            if (!messagesSnapshot.empty) {
              const lastMessage = messagesSnapshot.docs[0].data();
              usersWithMessages.push({
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email, // Ensure email is included
                lastMessage: lastMessage.content,
                lastMessageTime: lastMessage.time.toDate(),
                streak: lastMessage.streak || 0,
              });
            }
          }
        }

        usersWithMessages.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        setContacts(usersWithMessages);
        setFilteredContacts(usersWithMessages);
      } catch (error) {
        console.error("Error fetching chats with messages:", error);
      }
    };

    fetchChatsWithMessages();
  }, [currentUserUid]);

  const handleSearch = (users) => {
    setFilteredContacts(users.length > 0 ? users : contacts);
  };

  return (
    <div className='w-2/6 bg-gray-800 h-full flex flex-col'>
      <Navbar />
      <Search onSearch={handleSearch} contacts={contacts} /> {/* Pass contacts */}
      <div className="flex-1 overflow-y-auto relative">
        <Chats contacts={filteredContacts} onSelectChat={onSelectChat} />
      </div>
    </div>
  );
};

export default SideBar;
