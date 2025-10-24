import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.ok) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(res.error?.error || 'Invalid credentials');
    }
  };

  if (loading) return <Loader text="Signing in..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign in</h2>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 text-gray-700">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
