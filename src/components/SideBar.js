import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

const SideBar = ({ onSelectChat }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setContacts(users);
        setFilteredContacts(users); // Initialize filteredContacts with all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
}

export default SideBar;
