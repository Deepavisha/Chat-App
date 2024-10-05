import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import Input from './Input';
import ChatNavBar from './ChatNavBar';
import { db, auth } from '../firebase';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import PhotoPopup from './PhotoPopup';
import UserDetails from './UserDetails';
import { format, isSameDay, differenceInCalendarDays} from 'date-fns';

// Utility function to format date headers
const formatMessageDate = (date) => {
  const now = new Date();
  
  if (isSameDay(date, now)) {
    // If the date is today, return 'Today'
    return 'Today';
  }

  const differenceInDays = differenceInCalendarDays(now, date);

  if (differenceInDays <= 6) {
    // If the date is within the past 7 days, return the day name (e.g., Monday)
    return format(date, 'EEEE');
  } else {
    // Otherwise, return the full date
    return format(date, 'MMMM d, yyyy');
  }
};

const Chat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [chatUser, setChatUser] = useState(null); // State to store the chat user details
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedChat) return;
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Fetch user details including email from Firestore
    const userRef = doc(db, 'users', selectedChat.uid); // Assuming selectedChat.uid is the user's uid
    getDoc(userRef).then((doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setChatUser({ ...selectedChat, email: userData.email }); // Set chat user with email
      }
    });

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
  
    messages.forEach((message) => {
      // Check if message.time exists and is valid
      if (message.time && message.time.toDate) {
        const messageDate = message.time.toDate();
        const dateString = format(messageDate, 'yyyy-MM-dd');
        
        if (!grouped[dateString]) {
          grouped[dateString] = [];
        }
        grouped[dateString].push(message);
      } else {
        console.warn('Message missing time or invalid format:', message);
      }
    });
  
    return grouped;
  };
  

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

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="w-4/6 bg-gray-900 flex flex-col">
      {showPhoto && (
        <PhotoPopup user={selectedChat} onClose={closePhotoPopup} />
      )}
      {showUserDetails ? (
        <UserDetails 
        user={chatUser} 
        onClose={closeUserDetails} 
      />       
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
              // Display grouped messages with date headers
              Object.keys(groupedMessages).map((dateLabel) => (
                <React.Fragment key={dateLabel}>
                  {/* Use formatMessageDate to format the date label */}
                  <div className="text-center text-gray-400 my-4">
                    {formatMessageDate(new Date(dateLabel))}
                  </div>
                  {groupedMessages[dateLabel].map((message) => (
                    <Message
                      key={message.id}
                      message={message}
                      chatId={selectedChat.uid}
                      onDeleteMessage={handleDeleteMessage}
                    />
                  ))}
                </React.Fragment>
              ))
            ) : (
              <div className="text-gray-500 text-center mt-4">No messages yet</div>
            )}
            <div ref={messagesEndRef} />
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
