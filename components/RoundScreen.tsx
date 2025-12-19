
import React, { useState, useEffect, useCallback } from 'react';
import { GameTopic, Player, GameConfig } from '../types';
import { generateTopic, generateImageClue } from '../services/geminiService';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

interface RoundScreenProps {
  config: GameConfig;
  guesser: Player;
  onRoundComplete: (success: boolean, timeTaken: number) => void;
}

const RoundScreen: React.FC<RoundScreenProps> = ({ config, guesser, onRoundComplete }) => {
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<GameTopic | null>(null);
  const [cluesVisible, setCluesVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");

  const initRound = useCallback(async () => {
    setLoading(true);
    setCluesVisible(false);
    const newTopic = await generateTopic(config.language, config.difficulty);
    setTopic(newTopic);
    setTimeLeft(config.timeLimit);
    setLoading(false);
  }, [config.language, config.difficulty, config.timeLimit]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  useEffect(() => {
    let timer: number;
    if (!loading && cluesVisible && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onRoundComplete(false, config.timeLimit);
    }
    return () => clearInterval(timer);
  }, [loading, cluesVisible, timeLeft, onRoundComplete, config.timeLimit]);

  const handleGenerateImage = async () => {
    if (!topic) return;
    setImageGenerating(true);
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // Proceeding after dialog opens as per instructions
    }
    const imageUrl = await generateImageClue(topic, aspectRatio, imageSize);
    if (imageUrl) {
      setTopic({ ...topic, imageUrl });
    }
    setImageGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">AI is thinking...</h3>
          <p className="text-slate-500">Generating a clever topic for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-full flex items-center justify-center text-xl">
            <i className="fa-solid fa-user-secret"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">The Guesser</p>
            <h3 className="text-xl font-bold text-slate-900">{guesser.name}</h3>
          </div>
        </div>
        
        <div className={`text-3xl font-mono font-bold px-6 py-2 rounded-xl border-2 ${
          timeLeft <= 10 ? 'text-red-600 border-red-200 bg-red-50 animate-pulse' : 'text-slate-700 border-slate-100 bg-slate-50'
        }`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {!cluesVisible ? (
        <div className="bg-indigo-600 text-white p-12 rounded-3xl text-center space-y-8 shadow-xl shadow-indigo-200">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold">Ready to Start?</h2>
            <p className="text-indigo-100 max-w-md mx-auto">
              Make sure <strong>{guesser.name}</strong> cannot see the screen. Clue-givers, get ready to describe the topic!
            </p>
          </div>
          <button
            onClick={() => setCluesVisible(true)}
            className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
          >
            REVEAL TOPIC
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">Secret</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{topic?.category}</p>
                <h2 className="text-5xl font-black text-slate-900">{topic?.secret}</h2>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-ban"></i> Forbidden Words
                </h4>
                <div className="flex flex-wrap gap-3">
                  {topic?.forbidden.map((word, i) => (
                    <span key={i} className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-xl font-bold text-lg shadow-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onRoundComplete(true, config.timeLimit - timeLeft)}
                className="flex-1 bg-green-500 text-white py-6 rounded-3xl font-black text-2xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all hover:-translate-y-1"
              >
                GOT IT!
              </button>
              <button
                onClick={() => onRoundComplete(false, config.timeLimit - timeLeft)}
                className="bg-slate-200 text-slate-600 px-8 rounded-3xl font-bold hover:bg-slate-300 transition-all"
              >
                GIVE UP
              </button>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-image text-indigo-600"></i> AI Image Hint
                </h4>
                
                {topic?.imageUrl ? (
                  <img 
                    src={topic.imageUrl} 
                    alt="AI Hint" 
                    className="w-full rounded-2xl shadow-inner border border-slate-100 aspect-square object-cover" 
                  />
                ) : (
                  <div className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center p-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">No image generated yet. Clue-givers can use one for extra help!</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={aspectRatio} 
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      {ASPECT_RATIOS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select 
                      value={imageSize} 
                      onChange={(e) => setImageSize(e.target.value)}
                      className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    >
                      {IMAGE_SIZES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleGenerateImage}
                    disabled={imageGenerating}
                    className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {imageGenerating ? (
                      <><i className="fa-solid fa-circle-notch animate-spin"></i> Painting...</>
                    ) : (
                      <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Image</>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center leading-tight">
                    Requires a Pro API key. Help teammates by describing the visual.
                  </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundScreen;
