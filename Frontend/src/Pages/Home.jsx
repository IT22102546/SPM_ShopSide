import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Home() {
const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

 

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-semibold">Welcome, {currentUser?.shopname || 'Guest'}</h1>
        <h1 className="text-center text-2xl font-semibold">{currentUser?.email || 'Guest'}</h1>
        {/* Display additional user data as needed */}
      </div>
    </div>
  );
}
