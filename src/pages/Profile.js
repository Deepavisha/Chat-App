import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const { currentUser } = useContext(AuthContext); // Get the current user from AuthContext
  const navigate = useNavigate(); // Use for navigation

  // State to handle user details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [username, setUsername] = useState('');
  const [showAboutPopup, setShowAboutPopup] = useState(false); // State to show/hide the popup
  const [showNamePopup, setShowNamePopup] = useState(false); // State to show/hide name popup
  const [showEmailPopup, setShowEmailPopup] = useState(false); // State to show/hide email popup
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [newAbout, setNewAbout] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setnewUsername] = useState('');
  const [isAboutHovered, setIsAboutHovered] = useState(false); // State to handle hover on about section
  const [isNameHovered, setIsNameHovered] = useState(false); // State to handle hover on name section
  const [isEmailHovered, setIsEmailHovered] = useState(false); // State to handle hover on email section
  const [isUsernameHovered, setIsUsernameHovered] = useState(false);

  // Navigate back to the chat (home) page
  const goBack = () => navigate('/');

  // Fetch user details from Firestore when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if currentUser is defined
      if (!currentUser || !currentUser.uid) {
        console.error('Current user is not defined or does not have a uid');
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name || currentUser.displayName || 'User Name');
        setEmail(docSnap.data().email || currentUser.email || 'user@example.com');
        setAbout(docSnap.data().about || "Hey Guys, I am using Chat App!");
        setUsername(docSnap.data().username || "@username");
      } else {
        console.log('No such document!');
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Open the popup for editing "About"
  const openAboutPopup = () => {
    setNewAbout(about); // Pre-fill the input with current about
    setShowAboutPopup(true);
  };

  const openUsernamePopup =()=>{
    setnewUsername(username);
    setShowUsernamePopup(true);
  }
  // Open the popup for editing "Name"
  const openNamePopup = () => {
    setNewName(name); // Pre-fill the input with current name
    setShowNamePopup(true);
  };

  // Open the popup for editing "Email"
  const openEmailPopup = () => {
    setNewEmail(email); // Pre-fill the input with current email
    setShowEmailPopup(true);
  };

  // Close the popup without saving
  const closeAboutPopup = () => setShowAboutPopup(false);
  const closeNamePopup = () => setShowNamePopup(false);
  const closeEmailPopup = () => setShowEmailPopup(false);
  const closeUsernamePopup = () => setShowUsernamePopup(false);

  // Function to update the "About" section in Firestore
  const updateAbout = async () => {
    if (newAbout.trim() === '') {
      alert('Please enter a valid about text.');
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { about: newAbout }, { merge: true }); // Update the about field
      setAbout(newAbout); // Update the state to reflect the new "About" text
      closeAboutPopup(); // Close the popup
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about. Please try again.');
    }
  };

  //Function to Update Username
  const updateuserName = async () => {
    if (newUsername.trim() === '') {
      alert('Please enter a valid userName');
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { username: newUsername }, { merge: true }); // Update the username field
      setUsername(newUsername);// Update the state to reflect the new "Username" text
      closeUsernamePopup(); // Close the popup
    } catch (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about. Please try again.');
    }
  };

  // Function to update the "Name" section in Firestore
  const updateName = async () => {
    if (newName.trim() === '') {
      alert('Please enter a valid name.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { name: newName }, { merge: true }); // Update the name field
      setName(newName); // Update the state to reflect the new "Name" text
      closeNamePopup(); // Close the popup
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    }
  };

  // Function to update the "Email" section in Firestore
  const updateEmail = async () => {
    if (newEmail.trim() === '') {
      alert('Please enter a valid email.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { email: newEmail }, { merge: true }); // Update the email field
      setEmail(newEmail); // Update the state to reflect the new "Email" text
      closeEmailPopup(); // Close the popup
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-gray-200 h-screen relative">
      {/* Back arrow icon */}
      <ArrowLeftIcon
        onClick={goBack}
        className="absolute top-4 left-4 w-8 h-8 text-yellow-500 cursor-pointer"
      />

      {/* Title centered at the top */}
      <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#feab01] to-[#e23c00]">User Info</h1>

      <div className="flex flex-col md:flex-row justify-center items-start">
        {/* Left Side - Profile Picture */}
        <div className="md:w-2/4 flex justify-center mt-12 border-r border-yellow-500">
          <img
            src={currentUser?.photoURL || '/default-profile-pic.png'}
            alt="Profile"
            className="w-80 h-80 rounded-full object-cover"
          />
        </div>

        {/* Right Side - User Details */}
        <div className="md:w-2/4 pl-8 mt-32 ml-10">
          {/* Name Section */}
          <div className="flex items-center mb-4"
               onMouseEnter={() => setIsNameHovered(true)} 
               onMouseLeave={() => setIsNameHovered(false)} // Set hover state
          >
            <h2 className="text-xl font-bold">Name: {name}</h2>
            {isNameHovered && ( // Display Pencil icon only when hovered
              <PencilIcon
                className="ml-2 w-6 h-6 text-yellow-500 cursor-pointer"
                onClick={openNamePopup} // Open the popup to edit name
              />
            )}
          </div>

          {/*Username Section */}
          <div className="flex items-center mb-4"
               onMouseEnter={() => setIsUsernameHovered(true)} 
               onMouseLeave={() => setIsUsernameHovered(false)} // Set hover state
          >
            <h2 className="text-xl font-bold">Username: {username}</h2>
            {isUsernameHovered && ( // Display Pencil icon only when hovered
              <PencilIcon
                className="ml-2 w-6 h-6 text-yellow-500 cursor-pointer"
                onClick={openUsernamePopup} // Open the popup to edit name
              />
            )}
          </div>

          {/* Email Section */}
          <div className="flex items-center mb-4"
               onMouseEnter={() => setIsEmailHovered(true)} 
               onMouseLeave={() => setIsEmailHovered(false)} // Set hover state
          >
            <p className="text-xl"><strong>Email:</strong> {email}</p>
            {isEmailHovered && ( // Display Pencil icon only when hovered
              <PencilIcon
                className="ml-2 w-6 h-6 text-yellow-500 cursor-pointer"
                onClick={openEmailPopup} // Open the popup to edit email
              />
            )}
          </div>

          {/* About Section */}
          <div className="mt-4 flex items-center"
               onMouseEnter={() => setIsAboutHovered(true)} 
               onMouseLeave={() => setIsAboutHovered(false)} // Set hover state
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-300">
              About: <span className='text-lg text-gray-100'>{about}</span>
            </h3>
            {isAboutHovered && ( // Display Pencil icon only when hovered
              <PencilIcon
                className="ml-2 w-6 h-6 text-yellow-500 cursor-pointer"
                onClick={openAboutPopup} // Open the popup to edit about
              />
            )}
          </div>
        </div>
      </div>

      {/* Popup for editing the About section */}
      {showAboutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-white mb-4">Edit About</h2>
            <textarea
              className="w-full p-2 mb-4 text-black rounded"
              value={newAbout}
              onChange={(e) => setNewAbout(e.target.value)}
              placeholder="Enter your new about information..."
              rows={4}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeAboutPopup}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={updateAbout} // Update the about information
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for editing the Name section */}
      {showNamePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-white mb-4">Edit Name</h2>
            <input
              className="w-full p-2 mb-4 text-black rounded"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your new name..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeNamePopup}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={updateName} // Update the name information
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for editing the Username section */}
      {showUsernamePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-white mb-4">Edit Username</h2>
            <input
              className="w-full p-2 mb-4 text-black rounded"
              value={newUsername}
              onChange={(e) => setnewUsername(e.target.value)}
              placeholder="Enter your new Username..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeUsernamePopup}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={updateuserName} // Update the username information
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for editing the Email section */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-white mb-4">Edit Email</h2>
            <input
              className="w-full p-2 mb-4 text-black rounded"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeEmailPopup}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={updateEmail} // Update the email information
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;