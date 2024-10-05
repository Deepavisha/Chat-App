import React, { useState } from 'react'; // Ensure useState is imported
// Import other dependencies as needed

const Search = ({ onSearch, contacts }) => {
  const [username, setUserName] = useState("");
  const [err, setError] = useState(false);

  const handleSearch = (input) => {
    setUserName(input);

    if (input.trim() === "") {
      onSearch([]); // Clear results if input is empty
      setError(false); // Reset error state
      return;
    }

    const lowerCaseInput = input.toLowerCase(); // Convert input to lowercase

    // Filter contacts based on displayName or email
    const filteredUsers = contacts.filter((contact) =>
      contact.displayName.toLowerCase().includes(lowerCaseInput) ||
      contact.email.toLowerCase().includes(lowerCaseInput)
    );

    if (filteredUsers.length > 0) {
      onSearch(filteredUsers); // Send matching users to parent
      setError(false); // Reset error state
    } else {
      onSearch([]); // No matching users
      setError(true); // Set error state
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