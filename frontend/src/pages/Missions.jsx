import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Missions() {
  const [history, setHistory] = useState([
    "CYBER_OPS TERMINAL v4.2.1",
    "Secure uplink established.",
    "Type 'help' for available commands."
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const addXp = useStore(state => state.addXp);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      setInput('');
      setHistory(prev => [...prev, `root@cyber-ops:~# ${cmd}`]);

      if (cmd === '') return;

      setTimeout(() => {
        let response = '';
        switch (cmd) {
          case 'help': 
            response = 'COMMANDS: nmap (scan), decrypt (crack hash), breach (inject payload), clear'; 
            break;
          case 'nmap': 
            response = 'Scanning 192.168.1.1... Ports 22, 80 OPEN. Vulnerability found in SSH service.'; 
            break;
          case 'decrypt': 
            response = '[||||||||||] 100% - Decryption successful. Payload acquired! +50 XP'; 
            addXp(50);
            break;
          case 'breach': 
            response = 'WARNING: Countermeasures activated. Connection dropped.'; 
            break;
          case 'clear': 
            setHistory([]); 
            return;
          default: 
            response = `Command not found: ${cmd}`;
        }
        setHistory(prev => [...prev, response]);
      }, 500);
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <TerminalIcon /> TACTICAL TERMINAL
          </h1>
          <p className="text-gray-400 font-body">Execute operations and interact with remote nodes.</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Terminal Window */}
        <div className="flex-1 glass-panel border border-cyan-500/30 flex flex-col p-4 rounded-sm shadow-[0_0_20px_rgba(0,224,255,0.1)] hover:shadow-[0_0_40px_rgba(0,224,255,0.2)] hover:border-cyan-400 focus-within:border-cyan-400 focus-within:shadow-[0_0_40px_rgba(0,224,255,0.3)] transition-all duration-500 overflow-hidden group">
          <div className="flex gap-2 mb-4 border-b border-cyan-500/20 pb-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto font-code text-sm text-cyan-400 flex flex-col gap-1 custom-scrollbar pr-2 pb-4">
            {history.map((line, i) => (
              <div key={i} className={line.includes('WARNING') ? 'text-error' : line.includes('XP') ? 'text-secondary-container' : ''}>
                {line}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 font-code text-sm text-cyan-400 border-t border-cyan-500/20 pt-4 mt-2 group-focus-within:border-cyan-400 transition-colors">
            <span className="drop-shadow-[0_0_5px_rgba(0,224,255,0.8)]">root@cyber-ops:~#</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent border-none outline-none text-cyan-400 shadow-none focus:ring-0 placeholder-cyan-900 focus:drop-shadow-[0_0_5px_rgba(0,224,255,0.8)] transition-all"
              autoFocus
              spellCheck="false"
            />
            <div className={`w-2 h-4 bg-cyan-400 ${input ? 'animate-none' : 'animate-pulse'}`}></div>
          </div>
        </div>

        {/* Mission Objectives */}
        <aside className="w-80 flex flex-col gap-6">
          <div className="glass-panel border border-cyan-500/20 p-6 flex-1 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,224,255,0.15)] transition-all duration-300">
             <h3 className="font-code text-cyan-400 tracking-widest text-sm mb-4 border-b border-cyan-500/20 pb-2 flex items-center gap-2"><AlertTriangle size={14} className="animate-pulse" /> ACTIVE DIRECTIVES</h3>
             <ul className="space-y-4">
               <li className="flex gap-3 group cursor-pointer hover:pl-2 transition-all duration-300 hover:bg-error/10 p-2 -ml-2 rounded border border-transparent hover:border-error/30">
                 <div className="mt-1"><AlertTriangle size={16} className="text-error group-hover:scale-110 transition-transform"/></div>
                 <div>
                   <div className="font-bold text-sm text-white group-hover:text-error transition-colors">Scan Mainframe</div>
                   <div className="text-xs text-gray-400 group-hover:text-gray-300">Use nmap to find vulnerabilities</div>
                 </div>
               </li>
               <li className="flex gap-3 group cursor-pointer hover:pl-2 transition-all duration-300 hover:bg-secondary-container/10 p-2 -ml-2 rounded border border-transparent hover:border-secondary-container/30">
                 <div className="mt-1"><AlertTriangle size={16} className="text-secondary-container group-hover:scale-110 transition-transform"/></div>
                 <div>
                   <div className="font-bold text-sm text-white group-hover:text-secondary-container transition-colors">Decrypt Payload</div>
                   <div className="text-xs text-gray-400 group-hover:text-gray-300">Extract the secure hash</div>
                 </div>
               </li>
             </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}
