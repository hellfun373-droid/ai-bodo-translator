import React, { useState, useEffect, useMemo } from 'react';
import { Phrase } from '../types';
import { LightbulbIcon, ThumbsUpIcon, CheckIcon, XIcon, LogInIcon } from './icons/Icons';

interface ContributionHubProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  untranslated: string[];
  phrases: Phrase[];
  onContribute: (contribution: { type: 'new'; data: Phrase } | { type: 'verification' }) => void;
}

type Task = { type: 'translate'; phrase: string } | { type: 'verify'; phrase: Phrase };

const ContributionHub: React.FC<ContributionHubProps> = ({ isLoggedIn, onLogin, untranslated, phrases, onContribute }) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [bodoInput, setBodoInput] = useState('');
  const [showThanks, setShowThanks] = useState(false);

  const availableTasks = useMemo((): Task[] => {
    const translationTasks: Task[] = untranslated.map(phrase => ({ type: 'translate', phrase }));
    const verificationTasks: Task[] = phrases.map(phrase => ({ type: 'verify', phrase }));
    return [...translationTasks, ...verificationTasks];
  }, [untranslated, phrases]);
  
  const selectNewTask = () => {
    if (availableTasks.length === 0) {
      setCurrentTask(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    setCurrentTask(availableTasks[randomIndex]);
    setBodoInput('');
  };

  useEffect(() => {
    if (isLoggedIn) {
        selectNewTask();
    }
  }, [untranslated, phrases, isLoggedIn]); 

  const showThanksMessage = () => {
    setShowThanks(true);
    setTimeout(() => {
        setShowThanks(false);
        selectNewTask();
    }, 1500);
  }

  const handleNewTranslationSubmit = () => {
    if (!bodoInput.trim() || !currentTask || currentTask.type !== 'translate') return;
    onContribute({
      type: 'new',
      data: {
        english: currentTask.phrase,
        bodo: bodoInput,
        pronunciation: '(user submitted)'
      }
    });
    showThanksMessage();
  };
  
  const handleVerificationSubmit = (isCorrect: boolean) => {
     if (!currentTask || currentTask.type !== 'verify') return;
     onContribute({ type: 'verification' });
     showThanksMessage();
  }

  const renderTask = () => {
    if (showThanks) {
        return (
            <div className="text-center p-8 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Thank You!</h3>
                <p className="text-slate-600 dark:text-slate-300">Your contribution helps everyone.</p>
            </div>
        )
    }

    if (!currentTask) {
      return <p className="text-center text-slate-500">No more contribution tasks available for now. Thank you for your help!</p>;
    }

    if (currentTask.type === 'translate') {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <LightbulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Translate a New Phrase
          </h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">Help teach the AI by providing the Bodo translation for:</p>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-4">
            <p className="text-xl font-bold text-center text-slate-800 dark:text-slate-100">"{currentTask.phrase}"</p>
          </div>
          <input
            type="text"
            value={bodoInput}
            onChange={(e) => setBodoInput(e.target.value)}
            placeholder="Enter Bodo translation..."
            className="w-full px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          />
          <button
            onClick={handleNewTranslationSubmit}
            disabled={!bodoInput.trim()}
            className="w-full mt-4 px-6 py-2 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all shadow-md"
          >
            Submit Translation (+10 points)
          </button>
        </div>
      );
    }

    if (currentTask.type === 'verify') {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <ThumbsUpIcon className="w-6 h-6 mr-2 text-green-500" />
            Verify a Translation
          </h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">Is this a correct translation? Your feedback improves accuracy.</p>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-4 space-y-2">
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">ENGLISH</span>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{currentTask.phrase.english}</p>
            </div>
             <div>
              <span className="font-semibold text-sky-600 dark:text-sky-500 text-sm">BODO</span>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{currentTask.phrase.bodo}</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
                onClick={() => handleVerificationSubmit(true)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-all shadow-md"
            >
                <CheckIcon className="w-5 h-5 mr-2" /> Correct (+2 points)
            </button>
            <button
                onClick={() => handleVerificationSubmit(false)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-all shadow-md"
            >
                <XIcon className="w-5 h-5 mr-2" /> Incorrect
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const LoggedOutView = () => (
    <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Join the Community!</h3>
      <p className="mt-2 mb-4 text-slate-600 dark:text-slate-300">
        Log in to start contributing, earn points, and help teach the Bodo AI.
      </p>
      <button 
        onClick={onLogin}
        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-all shadow-md transform hover:scale-105"
      >
        <LogInIcon className="w-5 h-5 mr-2" />
        Log In & Contribute
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-1 text-slate-700 dark:text-slate-200">Contribution Hub</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Help improve the AI and earn points!</p>
      <div className="min-h-[250px] flex items-center justify-center">
        {isLoggedIn ? renderTask() : <LoggedOutView />}
      </div>
    </div>
  );
};

export default ContributionHub;
