import React, { useMemo } from 'react';
import { TrophyIcon, StarIcon, LogInIcon } from './icons/Icons';
import { User } from '../types';

interface LeaderboardProps {
  isLoggedIn: boolean;
  currentUser: User | null;
  onLogin: () => void;
}

const mockLeaderboardData = [
  { name: 'Bodo Speaker A', points: 1250 },
  { name: 'Community Member', points: 980 },
  { name: 'Translator Pro', points: 760 },
  { name: 'Language Lover', points: 540 },
  { name: 'New Contributor', points: 210 },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ isLoggedIn, currentUser, onLogin }) => {
    
  const { sortedLeaderboard, userRank } = useMemo(() => {
    if (!currentUser) {
      return { sortedLeaderboard: mockLeaderboardData, userRank: null };
    }
    const combined = [...mockLeaderboardData, { name: currentUser.name, points: currentUser.points }];
    const sorted = combined.sort((a, b) => b.points - a.points);
    const rank = sorted.findIndex(user => user.name === currentUser.name) + 1;
    return { sortedLeaderboard: mockLeaderboardData, userRank: rank };
  }, [currentUser]);

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-400 dark:text-yellow-300';
      case 2: return 'text-slate-400 dark:text-slate-300';
      case 3: return 'text-yellow-600 dark:text-yellow-700';
      default: return 'text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center text-slate-700 dark:text-slate-200">
        <TrophyIcon className="w-6 h-6 mr-2 text-sky-500" />
        Top Contributors
      </h2>
      <ul className="space-y-3 mb-6">
        {sortedLeaderboard.map((user, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center">
              <span className={`font-bold w-8 text-lg ${getRankColor(index + 1)}`}>{index + 1}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</span>
            </div>
            <div className="flex items-center space-x-1 font-bold text-slate-600 dark:text-slate-300">
              <span>{user.points}</span>
              <StarIcon className="w-4 h-4 text-yellow-400" />
            </div>
          </li>
        ))}
      </ul>
      
      <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-4">
        <h3 className="text-md font-semibold text-center text-slate-600 dark:text-slate-300 mb-2">Your Ranking</h3>
        {isLoggedIn && currentUser && userRank ? (
            <div className="flex items-center justify-between p-3 bg-sky-100 dark:bg-sky-900/50 rounded-lg border-2 border-sky-500">
              <div className="flex items-center">
                <span className={`font-bold w-8 text-lg ${getRankColor(userRank)}`}>{userRank}</span>
                <span className="font-bold text-sky-700 dark:text-sky-300">{currentUser.name}</span>
              </div>
              <div className="flex items-center space-x-1 font-bold text-sky-700 dark:text-sky-300">
                <span>{currentUser.points}</span>
                <StarIcon className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
        ) : (
          <div className="text-center p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
             <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Log in to see your rank and start earning points!</p>
             <button 
                onClick={onLogin}
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-all shadow-sm text-sm"
              >
                <LogInIcon className="w-4 h-4 mr-2" />
                Log In
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
