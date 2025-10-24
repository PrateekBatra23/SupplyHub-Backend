import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, fetchProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(profile || user, null, 2)}</pre>
    </div>
  );
}
