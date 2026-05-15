import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.code === 'KeyK')) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeCommand = (path) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="bg-[#10141a] border border-cyan-500 w-full max-w-lg shadow-[0_0_30px_rgba(0,224,255,0.3)] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-cyan-500/30 flex items-center gap-3">
          <Terminal size={20} className="text-cyan-400" />
          <input 
            autoFocus 
            className="flex-1 bg-transparent border-none outline-none text-white font-code text-lg" 
            placeholder="Search network or execute protocol..." 
            value={query} 
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="p-2 font-code text-sm">
          <div className="text-gray-500 text-xs px-3 py-2">QUICK JUMP PROTOCOLS</div>
          <button className="w-full text-left px-3 py-3 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300" onClick={() => executeCommand('/missions')}>
            /execute missions.sh
          </button>
          <button className="w-full text-left px-3 py-3 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300" onClick={() => executeCommand('/profile')}>
            /edit_profile agent_042
          </button>
          <button className="w-full text-left px-3 py-3 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300" onClick={() => executeCommand('/armory')}>
            /access black_market
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
