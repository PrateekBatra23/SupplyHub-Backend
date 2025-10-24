import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('scm_token'));
  const [user, setUser] = useState(() =>
    localStorage.getItem('scm_user')
      ? JSON.parse(localStorage.getItem('scm_user'))
      : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        localStorage.setItem('scm_user', JSON.stringify(decoded));
      } catch (err) {
        console.error('Invalid token', err);
        setToken(null);
        localStorage.removeItem('scm_token');
      }
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', credentials);
      const t = res.data.token;
      setToken(t);
      localStorage.setItem('scm_token', t);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('scm_user', JSON.stringify(res.data.user));
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data || err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('scm_token');
    localStorage.removeItem('scm_user');
    window.location.href = '/login';
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
      localStorage.setItem('scm_user', JSON.stringify(res.data));
      return res.data;
    } catch {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
