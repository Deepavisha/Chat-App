import React, { useState, useEffect } from 'react';
import Message from './Message';
import Input from './Input';
import ChatNavBar from './ChatNavBar';
import { db, auth } from '../firebase';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, getDocs } from 'firebase/firestore';
import PhotoPopup from './PhotoPopup';
import UserDetails from './UserDetails';

const Chat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    if (!selectedChat) return;

    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const chatId = [selectedChat.uid, userId].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('time'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched messages from Firestore: ", fetchedMessages);
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedChat]);

  const clearChat = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const chatId = [selectedChat.uid, userId].sort().join('_');
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      const querySnapshot = await getDocs(messagesRef);

      const deletePromises = querySnapshot.docs.map((messageDoc) => 
        deleteDoc(doc(db, 'chats', chatId, 'messages', messageDoc.id))
      );

      await Promise.all(deletePromises);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat: ', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !selectedChat) return;

      const chatId = [selectedChat.uid, userId].sort().join('_');
      const messageDocRef = doc(db, 'chats', chatId, 'messages', messageId);
      await deleteDoc(messageDocRef);

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const closeUserDetails = () => {
    setShowUserDetails(false);
  };

  const closePhotoPopup = () => {
    setShowPhoto(false);
  };

  return (
    <div className="w-4/6 bg-gray-900 flex flex-col">
      {showPhoto && (
        <PhotoPopup user={selectedChat} onClose={closePhotoPopup} />
      )}

      {showUserDetails ? (
        <UserDetails user={selectedChat} onClose={closeUserDetails} />
      ) : selectedChat ? (
        <>
          <ChatNavBar 
            user={selectedChat} 
            showUserDetails={() => setShowUserDetails(true)} 
            clearChat={clearChat} 
          />
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-gray-500 text-center mt-4">Loading messages...</div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  chatId={selectedChat.uid}
                  onDeleteMessage={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center mt-4">No messages yet</div>
            )}
          </div>
          <Input selectedChat={selectedChat} />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="text-gray-500 text-center mt-4">Start A Chat</div>
        </div>
      )}
    </div>
  );
};

export default Chat;