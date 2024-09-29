import React, { useState } from 'react';
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth ,storage, db} from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {

  const [err,setErr] =useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const sanitizedFileName = name.replace(/\s+/g, '_'); // Sanitize file name
      const storageRef = ref(storage, sanitizedFileName);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Optional: Handle progress, etc.
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await updateProfile(res.user, {
                displayName: name,
                photoURL: downloadURL,
              });
  
              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: name,
                email,
                photoURL: downloadURL,
              });
              await setDoc(doc(db, "userChats", res.user.uid), {});
              // Redirect to home page after successful registration
              navigate("/login");
  
              resolve();
            } catch (error) {
              console.error("Error during profile update or Firestore set:", error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setErr(true);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#feab01] to-[#e23c00]">Chat App</h2>
        </div>
        <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h5 className="text-center text-xl text-gray-300 font-bold">Register</h5>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input id="name" name="name" type="text" placeholder="Enter your Name" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 rounded-t-md bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"/>
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" placeholder="Enter Email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"/>
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter Password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 rounded-b-md bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"/>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300">
              Upload Profile Picture
            </label>
            <input id="file-upload" name="file-upload" type="file" className="mt-1 text-gray-300"/>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
              Sign Up
            </button>
          </div>
          {err && <span className='text-white ml-24'>Something went Wrong</span>}
        </form>
        <div className="text-center">
          <h5 className="text-gray-400">Do have an Account? <Link to="/login" className="text-yellow-400 hover:text-yellow-500">Login</Link></h5>
        </div>
      </div>
    </div>
  );
}

export default Register;