import React, { useState, useMemo } from 'react';
import { Phrase } from '../types';
import { BookOpenIcon, SearchIcon, PlusCircleIcon, StarIcon as StarFilledIcon, StarOutlineIcon } from './icons/Icons';

interface PhrasebookProps {
  phrases: Phrase[];
  favorites: Set<string>;
  onToggleFavorite: (englishPhrase: string) => void;
  onTranslateRequest: (text: string) => void;
}

const Phrasebook: React.FC<PhrasebookProps> = ({ phrases, favorites, onToggleFavorite, onTranslateRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const filteredPhrases = useMemo(() => {
    let phrasesToFilter = phrases;
    if (activeTab === 'favorites') {
      phrasesToFilter = phrases.filter(p => favorites.has(p.english));
    }
    
    if (!searchTerm) {
      return phrasesToFilter;
    }

    return phrasesToFilter.filter(
      phrase =>
        phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phrase.bodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phrase.pronunciation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, phrases, activeTab, favorites]);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const TabButton: React.FC<{ tab: 'all' | 'favorites'; label: string }> = ({ tab, label }) => (
     <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          activeTab === tab 
            ? 'bg-sky-600 text-white' 
            : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center text-slate-700 dark:text-slate-200">
        <BookOpenIcon className="w-6 h-6 mr-2 text-sky-500" />
        Phrasebook
      </h2>

      <div className="flex space-x-2 mb-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-full">
        <TabButton tab="all" label="All Phrases" />
        <TabButton tab="favorites" label="Favorites" />
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search phrases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <SearchIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2" style={{maxHeight: '400px'}}>
        {filteredPhrases.length > 0 ? (
          <ul className="space-y-3">
            {filteredPhrases.map((phrase) => (
              <li key={phrase.english} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-700 group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{phrase.english}</p>
                    <p className="text-lg font-medium text-sky-600 dark:text-sky-400">{phrase.bodo}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">{phrase.pronunciation}</p>
                  </div>
                  <div className="flex items-center opacity-50 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => onToggleFavorite(phrase.english)} 
                       title={favorites.has(phrase.english) ? "Remove from favorites" : "Add to favorites"} 
                       className="text-slate-400 hover:text-yellow-500 transition-colors p-1"
                     >
                       {favorites.has(phrase.english) ? <StarFilledIcon className="w-5 h-5 text-yellow-400" /> : <StarOutlineIcon className="w-5 h-5" />}
                     </button>
                     <button onClick={() => handleCopy(phrase.bodo)} title="Copy Bodo phrase" className="text-slate-400 hover:text-sky-500 transition-colors p-1">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                     </button>
                   </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            {activeTab === 'favorites' && !searchTerm ? (
              <>
                <StarOutlineIcon className="w-12 h-12 mx-auto text-slate-400 mb-2"/>
                <p className="font-semibold">No Favorites Yet</p>
                <p className="text-sm mt-1">Click the star next to a phrase to save it here.</p>
              </>
            ) : (
              <>
                 <p className="font-semibold">Phrase not found.</p>
                <p className="text-sm mt-1 mb-4">Help expand the phrasebook by translating it.</p>
                <button
                  onClick={() => onTranslateRequest(searchTerm)}
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md"
                >
                  <PlusCircleIcon className="w-5 h-5 mr-2"/>
                  Translate '{searchTerm}'
                </button>
              </>
            )}
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Phrasebook;
