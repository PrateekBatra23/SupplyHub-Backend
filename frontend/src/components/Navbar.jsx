import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white px-6 py-3 shadow">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">SCM Portal</h1>
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">
          {user.role}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
