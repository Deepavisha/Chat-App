import React, { useState } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';

const Search = ({ onSearch }) => {
  const [username, setUserName] = useState("");
  const [err, setError] = useState(false);

  const handleSearch = async (input) => {
    setUserName(input);

    if (input.trim() === "") {
      onSearch([]); // Clear results if input is empty
      setError(false); // Reset error state
      return;
    }

    try {
      const lowerCaseInput = input.toLowerCase(); // Convert input to lowercase

      const q = query(
        collection(db, "users"),
        orderBy("displayName") // Keep ordering by displayName
      );

      const querySnapshot = await getDocs(q);
      const users = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          // Check if the displayName starts with the lowercase input
          if (userData.displayName.toLowerCase().startsWith(lowerCaseInput)) {
            users.push({ id: doc.id, ...userData });
          }
        });

        if (users.length > 0) {
          onSearch(users); // Send matching users to parent
          setError(false); // Reset error state
        } else {
          onSearch([]); // No matching users
          setError(true); // Set error state
        }
      } else {
        onSearch([]); // Reset to empty array if no results
        setError(true);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      onSearch([]); // Reset to empty array on error
      setError(true);
    }
  };

  return (
    <div className="p-4 bg-gray-800">
      <input
        type="text"
        value={username}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search User"
        className="w-full px-3 py-2 rounded-md bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      {err && <span className="text-red-500">No user found</span>}
    </div>
  );
};

export default Search;
