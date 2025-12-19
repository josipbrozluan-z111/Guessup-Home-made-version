
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import SetupScreen from './components/SetupScreen';
import RoundScreen from './components/RoundScreen';
import { GameState, GameConfig, Player, Language, Difficulty } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [config, setConfig] = useState<GameConfig>({
    language: Language.ENGLISH,
    difficulty: Difficulty.MEDIUM,
    maxPoints: 10,
    timeLimit: 90
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [guesserIndex, setGuesserIndex] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);

  const startGame = (gameConfig: GameConfig, initialPlayers: Player[]) => {
    setConfig(gameConfig);
    setPlayers(initialPlayers);
    setGameState(GameState.ROUND_START);
    setGuesserIndex(0);
  };

  const handleRoundComplete = (success: boolean, timeTaken: number) => {
    if (success) {
      const updatedPlayers = [...players];
      // Guesser gets 1 point
      updatedPlayers[guesserIndex].score += 1;
      
      // Speed bonus
      if (timeTaken < config.timeLimit / 2) {
        updatedPlayers[guesserIndex].score += 1;
      }
      
      setPlayers(updatedPlayers);

      // Check for winner
      if (updatedPlayers[guesserIndex].score >= config.maxPoints) {
        setWinner(updatedPlayers[guesserIndex]);
        setGameState(GameState.GAME_OVER);
        return;
      }
    }

    // Move to next guesser
    setGuesserIndex((guesserIndex + 1) % players.length);
    setGameState(GameState.RESULTS);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {gameState === GameState.LOBBY && (
            <div className="text-center py-12 space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                  Behind the <span className="text-indigo-600">Screen</span> Guesser
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  A clever word-guessing game powered by AI. Describe secret topics to your teammate who's isolated behind the screen!
                </p>
              </div>
              <button
                onClick={() => setGameState(GameState.SETUP)}
                className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
              >
                CREATE ROOM
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: 'fa-robot', title: 'AI Topics', desc: 'Dynamically generated unique challenges.' },
                  { icon: 'fa-language', title: 'Multilingual', desc: 'Practice English, Finnish, or Vietnamese.' },
                  { icon: 'fa-wand-magic-sparkles', title: 'Visual Clues', desc: 'AI generates images to help your team.' }
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
                    <i className={`fa-solid ${feature.icon} text-indigo-500 text-2xl mb-4`}></i>
                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameState === GameState.SETUP && (
            <SetupScreen onStart={startGame} />
          )}

          {(gameState === GameState.ROUND_START || gameState === GameState.RESULTS) && (
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl mx-auto rotate-3">
                  <i className="fa-solid fa-play"></i>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Next Round</h2>
                  <p className="text-slate-500 font-medium">It's time for a new challenge!</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Guesser</p>
                  <p className="text-2xl font-black text-indigo-600">{players[guesserIndex].name}</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setGameState(GameState.CLUE_GIVING)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Start Round
                  </button>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Current Scores</h4>
                    <div className="space-y-2">
                      {players.map(p => (
                        <div key={p.id} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-700">{p.name}</span>
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">{p.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === GameState.CLUE_GIVING && (
            <RoundScreen 
              config={config} 
              guesser={players[guesserIndex]} 
              onRoundComplete={handleRoundComplete}
            />
          )}

          {gameState === GameState.GAME_OVER && (
            <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden text-center p-12 space-y-8 animate-in zoom-in duration-500">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-5xl mx-auto animate-bounce">
                  <i className="fa-solid fa-crown"></i>
                </div>
                <h1 className="text-4xl font-black text-slate-900 uppercase">Victory!</h1>
                <p className="text-xl text-slate-500">
                  <span className="font-black text-indigo-600">{winner?.name}</span> has reached the goal!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                {players.sort((a,b) => b.score - a.score).map((p, i) => (
                  <div key={p.id} className={`p-4 rounded-2xl flex items-center justify-between ${i === 0 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-700'}`}>
                    <span className="font-bold">#{i+1} {p.name}</span>
                    <span className="font-black">{p.score}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setGameState(GameState.LOBBY)}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Behind the Screen Guesser</p>
          <p className="text-xs text-slate-400">Created with ❤️ and Gemini AI for language learning & family fun</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
