import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-700 animate-pulse">{text}</div>
    </div>
  );
}
