
import React, { useState } from 'react';
import { GameConfig, Language, Difficulty, Player } from '../types';
import { LANGUAGES, DIFFICULTIES, DEFAULT_TIME_LIMIT, DEFAULT_MAX_POINTS } from '../constants';

interface SetupScreenProps {
  onStart: (config: GameConfig, players: Player[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [maxPoints, setMaxPoints] = useState(DEFAULT_MAX_POINTS);
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME_LIMIT);
  const [playerInput, setPlayerInput] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayer = () => {
    if (playerInput.trim() && players.length < 6) {
      setPlayers([...players, { id: Math.random().toString(36).substr(2, 9), name: playerInput.trim(), score: 0 }]);
      setPlayerInput('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleStart = () => {
    if (players.length < 2) {
      alert("Please add at least 2 players!");
      return;
    }
    onStart({ language, difficulty, maxPoints, timeLimit }, players);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-indigo-50 border-b border-indigo-100">
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <i className="fa-solid fa-gear"></i> Game Configuration
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
              <div className="grid grid-cols-1 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      language === lang.code 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </span>
                    {language === lang.code && <i className="fa-solid fa-circle-check"></i>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
              <div className="grid grid-cols-1 gap-2">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff.level}
                    onClick={() => setDifficulty(diff.level)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      difficulty === diff.level 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <span className="font-medium">{diff.name}</span>
                    {difficulty === diff.level && <i className="fa-solid fa-circle-check"></i>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Win Condition (Points)</label>
              <input 
                type="number" 
                value={maxPoints} 
                onChange={e => setMaxPoints(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Time per Round (Sec)</label>
              <input 
                type="number" 
                value={timeLimit} 
                onChange={e => setTimeLimit(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-user-plus"></i> Players (3-6)
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter player name..."
              value={playerInput}
              onChange={e => setPlayerInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPlayer()}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <button
              onClick={addPlayer}
              disabled={!playerInput.trim() || players.length >= 6}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map(player => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="font-medium text-slate-700">{player.name}</span>
                <button onClick={() => removePlayer(player.id)} className="text-red-400 hover:text-red-600 p-1">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
          >
            Start Gaming Session
          </button>
        </div>
      </section>
    </div>
  );
};

export default SetupScreen;
