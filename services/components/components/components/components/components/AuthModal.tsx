import React, { useState } from 'react';
import { User } from '../types';
import { XIcon, UserIcon, KeyIcon } from './icons/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSwitchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setError(null);
    setUsername('');
    setPassword('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('aiBodoTranslatorUsers') || '{}');
    const user = users[username];

    if (user && user.password === password) {
      setError(null);
      onLoginSuccess({ name: username, points: user.points || 0 });
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleRegister = () => {
    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('aiBodoTranslatorUsers') || '{}');

    if (users[username]) {
      setError('Username already exists. Please choose another or log in.');
    } else {
      users[username] = { password, points: 0 };
      localStorage.setItem('aiBodoTranslatorUsers', JSON.stringify(users));
      setError(null);
      onLoginSuccess({ name: username, points: 0 });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
          {authMode === 'login' ? 'Welcome Back!' : 'Join the Community'}
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
          {authMode === 'login'
            ? 'Log in to continue your contributions.'
            : 'Create an account to start contributing and earning points.'}
        </p>

        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="username"
                className="absolute -top-2 left-2 inline-block bg-white dark:bg-slate-800 px-1 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Username
              </label>
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-3 pl-10 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
              />
            </div>
             <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-2 left-2 inline-block bg-white dark:bg-slate-800 px-1 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Password
              </label>
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-3 pl-10 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <button
            type="submit"
            className="w-full mt-6 py-3 px-4 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 disabled:bg-slate-400 transition-all shadow-md transform hover:scale-105"
          >
            {authMode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => handleSwitchMode(authMode === 'login' ? 'register' : 'login')}
            className="font-semibold text-sky-600 dark:text-sky-400 hover:underline ml-1"
          >
            {authMode === 'login' ? 'Register' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
