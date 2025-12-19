
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <i className="fa-solid fa-ghost text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Behind the Screen Guesser
            </h1>
            <p className="text-xs text-slate-500 font-medium">AI-POWERED WORD GUESSING</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-users"></i>
            <span>3-6 Players</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-language"></i>
            <span>Multi-lang</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
