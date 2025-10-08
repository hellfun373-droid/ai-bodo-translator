import React from 'react';
import { StarIcon, LogOutIcon } from './icons/Icons';
import { User } from '../types';

interface GamificationProps {
  user: User;
  onLogout: () => void;
}

const Gamification: React.FC<GamificationProps> = ({ user, onLogout }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-full shadow-inner">
        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm hidden sm:inline">{user.name}</span>
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-slate-700 dark:text-slate-200">{user.points}</span>
      </div>
       <button 
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition" 
          title="Log Out">
          <LogOutIcon className="w-5 h-5" />
       </button>
    </div>
  );
};

export default Gamification;
