import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
      <p className="mt-2 text-gray-600">
        Role: <span className="font-semibold">{user?.role}</span>
      </p>
      <p className="mt-6 text-gray-700">
        This is your SCM dashboard.
      </p>
    </div>
  );
}
