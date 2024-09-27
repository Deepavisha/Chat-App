import React from 'react';
import { useState} from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {

  const [err,setErr] =useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    }catch{
      setErr(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-yellow-300">Chat App</h2>
        </div>
        <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h5 className="font-bold text-center text-xl text-gray-300">Login</h5>
          <div className="rounded-md shadow-sm space-y-6">
            <div className="mt-2">
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" placeholder="Enter Email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"/>
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter Password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 rounded-b-md bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"/>
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
              Sign In
            </button>
          </div>
          {err && <span className='text-gray-100 ml-20'>Invalid Username or password</span>}
        </form>
        <div className="text-center">
          <h5 className="text-gray-400">Don't have an Account? <Link to="/register" className="text-yellow-400 hover:text-yellow-500">Register</Link></h5>
        </div>
      </div>
    </div>
  );
}

export default Login;
