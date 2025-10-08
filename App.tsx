import React, { useState } from 'react';
import Translator from './components/Translator';
import Phrasebook from './components/Phrasebook';
import Gamification from './components/Gamification';
import ContributionHub from './components/ContributionHub';
import Leaderboard from './components/Leaderboard';
import AuthModal from './components/AuthModal';
import { Phrase, User } from './types';
import { LogInIcon } from './components/icons/Icons';

const initialPhrases: Phrase[] = [
  { english: 'Hello', bodo: 'खुलुमबाय', pronunciation: 'Kulumbay' },
  { english: 'How are you?', bodo: 'माबोरै दं?', pronunciation: 'Maborai dong?' },
  { english: 'I am fine', bodo: 'मोजांङैनो दं', pronunciation: 'Mojangaino dong' },
  { english: 'Thank you', bodo: 'साबायखर', pronunciation: 'Sabaykhor' },
  { english: 'What is your name?', bodo: 'नोंनि मुङा मा?', pronunciation: 'Nongni munga ma?' },
  { english: 'My name is...', bodo: 'आंनि मुङा...', pronunciation: 'Angni munga...' },
  { english: 'Goodbye', bodo: 'थाबाय', pronunciation: 'Thabai' },
  { english: 'Yes', bodo: 'औ', pronunciation: 'Ou' },
  { english: 'No', bodo: 'नङा', pronunciation: 'Nonga' },
  { english: 'Please', bodo: 'अननानै', pronunciation: 'Onnanai' },
  { english: 'Sorry', bodo: 'निमाहा', pronunciation: 'Nimaha' },
  { english: 'Water', bodo: 'दै', pronunciation: 'Doi' },
  { english: 'Food', bodo: 'जाग्रा', pronunciation: 'Jagra' },
  { english: 'I love you', bodo: 'आं नोंखौ मोजां मोनो', pronunciation: 'Ang nongkhou mojang mono'},
  { english: 'Where is the market?', bodo: 'बोजारा बबेयाव?', pronunciation: 'Bojara bobeyao?' },
  { english: 'How much is this?', bodo: 'बेनि बेसेना बेसे?', pronunciation: 'Beni besena bese?' },
  { english: 'I don\'t understand', bodo: 'आं बुजियासै', pronunciation: 'Ang bujiyasoi' },
  { english: 'Can you help me?', bodo: 'नों आंखौ मदद खालामनो हागोन?', pronunciation: 'Nong angkou modot khalamno hagon?' },
];

const initialUntranslated: string[] = [
  'Good morning',
  'Good night',
  'What is the time?',
  'I am hungry',
  'Let\'s go',
  'Where is the bathroom?',
  'I am learning Bodo',
];

const App: React.FC = () => {
  const [phrases, setPhrases] = useState<Phrase[]>(initialPhrases);
  const [untranslatedPhrases, setUntranslatedPhrases] = useState<string[]>(initialUntranslated);
  const [translatorInput, setTranslatorInput] = useState('');
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    if (currentUser) {
      // Save user's points to localStorage before logging out
      const users = JSON.parse(localStorage.getItem('aiBodoTranslatorUsers') || '{}');
      if (users[currentUser.name]) {
        users[currentUser.name].points = currentUser.points;
        localStorage.setItem('aiBodoTranslatorUsers', JSON.stringify(users));
      }
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleToggleFavorite = (englishPhrase: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(englishPhrase)) {
        newFavorites.delete(englishPhrase);
      } else {
        newFavorites.add(englishPhrase);
      }
      return newFavorites;
    });
  };

  const handleTranslateRequest = (text: string) => {
    setTranslatorInput(text);
    setIsAddingPhrase(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTranslatorContribution = (data: { source: string; corrected: string }) => {
    if (isLoggedIn && currentUser) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, points: prevUser.points + 5 } : null);
    }

    if (isAddingPhrase) {
      const newPhrase: Phrase = {
        english: data.source,
        bodo: data.corrected,
        pronunciation: '(user added)',
      };
      if (!phrases.some(p => p.english.toLowerCase() === newPhrase.english.toLowerCase())) {
        setPhrases(prevPhrases => [newPhrase, ...prevPhrases]);
      }
      setIsAddingPhrase(false);
      setTranslatorInput('');
    }
  };

  const handleHubContribution = (contribution: { type: 'new'; data: Phrase } | { type: 'verification' }) => {
    if (!isLoggedIn || !currentUser) return; // Contributions only count if logged in

    if (contribution.type === 'new') {
      const newPhrase = contribution.data;
      if (!phrases.some(p => p.english.toLowerCase() === newPhrase.english.toLowerCase())) {
        setPhrases(prevPhrases => [newPhrase, ...prevPhrases]);
      }
      setUntranslatedPhrases(prev => prev.filter(p => p !== newPhrase.english));
      setCurrentUser(prevUser => prevUser ? { ...prevUser, points: prevUser.points + 10 } : null);
    } else if (contribution.type === 'verification') {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, points: prevUser.points + 2 } : null);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            AI Bodo Translator
          </h1>
          {isLoggedIn && currentUser ? (
             <Gamification user={currentUser} onLogout={handleLogout} />
          ) : (
            <button 
              onClick={openAuthModal}
              className="inline-flex items-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-all shadow-md"
            >
              <LogInIcon className="w-5 h-5 mr-2" />
              Log In to Contribute
            </button>
          )}
        </nav>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Translator
              inputText={translatorInput}
              setInputText={setTranslatorInput}
              onContribute={handleTranslatorContribution}
            />
          </div>
          <div className="lg:col-span-1">
            <Phrasebook 
              phrases={phrases}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onTranslateRequest={handleTranslateRequest}
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
           <div className="md:col-span-2">
             <ContributionHub
              isLoggedIn={isLoggedIn}
              onLogin={openAuthModal}
              untranslated={untranslatedPhrases}
              phrases={phrases}
              onContribute={handleHubContribution}
            />
           </div>
           <div className="md:col-span-1">
              <Leaderboard 
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onLogin={openAuthModal}
              />
           </div>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; 2024 AI Bodo Translator. Empowering language preservation through technology.</p>
      </footer>
    </div>
  );
};

export default App;
