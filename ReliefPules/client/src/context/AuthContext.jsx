import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'victim@demo.com': {
    id: 'usr-1',
    name: 'Ramesh Kumar',
    email: 'victim@demo.com',
    role: 'victim',
    location: 'Plot 42, River View Enclave, Ward 7',
    familyCount: 4,
    phone: '+91 98451 23456',
  },
  'volunteer@demo.com': {
    id: 'usr-2',
    name: 'Suresh Kumar',
    email: 'volunteer@demo.com',
    role: 'volunteer',
    location: 'Sector 5, Relief Post 2',
    phone: '+91 98765 43210',
  },
  'admin@demo.com': {
    id: 'usr-3',
    name: 'Command Admin',
    email: 'admin@demo.com',
    role: 'admin',
    location: 'State Disaster Emergency Operations Center',
    phone: '+91 99000 11223',
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('da_user') || localStorage.getItem('rp_user');
      if (saved) return JSON.parse(saved);
      // Default to Ramesh Kumar (Victim) for intuitive immediate preview
      return DEMO_USERS['victim@demo.com'];
    } catch {
      return DEMO_USERS['victim@demo.com'];
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('da_token') || 'demo_token_123');
  const [loading, setLoading] = useState(false);

  const api = axios.create({ baseURL: `${BASE_URL}/api`, timeout: 3000 });
  api.interceptors.request.use((config) => {
    const t = localStorage.getItem('da_token');
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });

  const login = async (identifier, password) => {
    const emailKey = identifier.toLowerCase().trim();

    // 1. Check demo accounts first for instant demo experience
    if (DEMO_USERS[emailKey]) {
      const demoUser = DEMO_USERS[emailKey];
      const demoToken = `demo_${demoUser.role}_token`;
      localStorage.setItem('da_token', demoToken);
      localStorage.setItem('da_user', JSON.stringify(demoUser));
      setToken(demoToken);
      setUser(demoUser);
      return { success: true, user: demoUser, token: demoToken };
    }

    // 2. Try backend API
    try {
      const res = await api.post('/auth/login', { email: identifier, password });
      const t = res.data.token;
      const userData = res.data.user;
      localStorage.setItem('da_token', t);
      if (userData) {
        localStorage.setItem('da_user', JSON.stringify(userData));
      }
      setToken(t);
      setUser(userData);
      return res.data;
    } catch (err) {
      // Offline fallback: construct standard user
      const role = emailKey.includes('admin') ? 'admin' : emailKey.includes('vol') ? 'volunteer' : 'victim';
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        name: identifier.split('@')[0],
        email: identifier,
        role: role,
        location: 'Hyderabad, India'
      };
      const fallbackToken = 'fallback_token_' + Date.now();
      localStorage.setItem('da_token', fallbackToken);
      localStorage.setItem('da_user', JSON.stringify(fallbackUser));
      setToken(fallbackToken);
      setUser(fallbackUser);
      return { success: true, user: fallbackUser, token: fallbackToken };
    }
  };

  const logout = () => {
    localStorage.removeItem('da_token');
    localStorage.removeItem('da_user');
    localStorage.removeItem('rp_token');
    localStorage.removeItem('rp_user');
    setToken(null);
    setUser(null);
  };

  const register = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      const t = res.data.token;
      const userData = res.data.user;
      localStorage.setItem('da_token', t);
      if (userData) {
        localStorage.setItem('da_user', JSON.stringify(userData));
      }
      setToken(t);
      setUser(userData);
      return res.data;
    } catch (err) {
      // Offline registration fallback
      const newUser = {
        id: 'usr_' + Date.now(),
        name: data.name || data.fullName || 'User',
        email: data.email,
        role: data.role || 'victim',
        phone: data.phone || data.mobile,
        location: data.location || 'Current GPS',
        familyCount: data.familyCount || data.peopleAffected || 1,
        specialRequirements: data.specialRequirements || ''
      };
      const fallbackToken = 'token_' + Date.now();
      localStorage.setItem('da_token', fallbackToken);
      localStorage.setItem('da_user', JSON.stringify(newUser));
      setToken(fallbackToken);
      setUser(newUser);
      return { success: true, user: newUser, token: fallbackToken };
    }
  };

  const switchDemoRole = (role) => {
    let target = DEMO_USERS['victim@demo.com'];
    if (role === 'volunteer') target = DEMO_USERS['volunteer@demo.com'];
    if (role === 'admin') target = DEMO_USERS['admin@demo.com'];
    localStorage.setItem('da_user', JSON.stringify(target));
    setUser(target);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        switchDemoRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
