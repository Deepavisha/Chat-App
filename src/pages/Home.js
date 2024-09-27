import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import Chat from '../components/Chat';

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen">
      <SideBar onSelectChat={setSelectedChat} />
      <Chat selectedChat={selectedChat} />
    </div>
  );
}

export default Home;
