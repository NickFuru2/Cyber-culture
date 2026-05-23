import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

// Mission definitions with validation
const MISSIONS = {
  'nmap': {
    cmd: 'nmap',
    description: 'Scan target network for open ports',
    response: 'Scanning 192.168.1.1...\nPorts 22, 80, 443 OPEN.\nVulnerability found in SSH service.',
    xp: 30,
    label: 'Network Reconnaissance'
  },
  'decrypt': {
    cmd: 'decrypt',
    description: 'Crack encrypted payload',
    response: '[||||||||||] 100% - Decryption successful. Payload acquired!',
    xp: 50,
    label: 'Decrypt Payload'
  },
  'breach': {
    cmd: 'breach',
    description: 'Inject payload into target system',
    response: 'Injecting payload... Access granted! Root shell obtained.',
    xp: 75,
    label: 'System Breach'
  },
  'exploit': {
    cmd: 'exploit',
    description: 'Execute exploit against vulnerable service',
    response: 'Exploiting CVE-2024-1337... SUCCESS! Privilege escalation complete.',
    xp: 100,
    label: 'Exploit Execution'
  },
  'exfiltrate': {
    cmd: 'exfiltrate',
    description: 'Extract sensitive data from compromised system',
    response: 'Exfiltrating data... 1.2GB transferred. Mission complete.',
    xp: 80,
    label: 'Data Exfiltration'
  },
};

export default function Missions() {
  const [history, setHistory] = useState([
    "CYBER_OPS TERMINAL v4.2.1",
    "Secure uplink established.",
    "Type 'help' for available commands."
  ]);
  const [input, setInput] = useState('');
  const [completedMissions, setCompletedMissions] = useState(new Set());
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
            response = 'AVAILABLE COMMANDS:\n' +
              '  nmap       - Scan network for vulnerabilities\n' +
              '  decrypt    - Crack encrypted payload\n' +
              '  breach     - Inject payload into system\n' +
              '  exploit    - Execute exploit against target\n' +
              '  exfiltrate - Extract sensitive data\n' +
              '  missions   - Show completed missions\n' +
              '  clear      - Clear terminal';
            break;

          case 'missions':
            response = `COMPLETED MISSIONS: ${completedMissions.size}\n` +
              Array.from(completedMissions).map(m => `  ✓ ${MISSIONS[m]?.label || m}`).join('\n');
            break;

          case 'clear':
            setHistory([]);
            return;

          default:
            if (MISSIONS[cmd]) {
              const mission = MISSIONS[cmd];
              const alreadyCompleted = completedMissions.has(cmd);

              response = mission.response;

              if (!alreadyCompleted) {
                response += `\n[+${mission.xp} XP] Mission Complete!`;
                addXp(mission.xp, 'mission', mission.label);
                setCompletedMissions(prev => new Set([...prev, cmd]));
              } else {
                response += `\n[Mission already completed]`;
              }
            } else {
              response = `Command not found: ${cmd}\nType 'help' for available commands.`;
            }
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
        <div className="text-right">
          <div className="font-code text-xs text-gray-500">MISSIONS COMPLETED</div>
          <div className="font-code text-xl text-secondary-container">{completedMissions.size} / {Object.keys(MISSIONS).length}</div>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">

        {/* Mission List Sidebar */}
        <div className="w-80 glass-panel border border-cyan-500/20 p-4 rounded-sm flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <h3 className="font-code text-sm text-cyan-400 border-b border-cyan-500/20 pb-2 flex items-center gap-2">
            <Zap size={14} /> AVAILABLE MISSIONS
          </h3>
          {Object.entries(MISSIONS).map(([key, mission]) => {
            const isCompleted = completedMissions.has(key);
            return (
              <div
                key={key}
                className={`p-3 border rounded transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-secondary-container/30 bg-secondary-container/5'
                    : 'border-cyan-500/30 bg-cyan-900/10 hover:bg-cyan-900/20 hover:border-cyan-400'
                }`}
                onClick={() => setInput(key)}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-code text-xs text-white font-bold">{mission.cmd.toUpperCase()}</span>
                  {isCompleted ? (
                    <CheckCircle size={14} className="text-secondary-container" />
                  ) : (
                    <span className="font-code text-[10px] text-cyan-400">+{mission.xp} XP</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-body">{mission.description}</p>
              </div>
            );
          })}
        </div>

        {/* Terminal Window */}
        <div className="flex-1 glass-panel border border-cyan-500/30 flex flex-col p-4 rounded-sm shadow-[0_0_20px_rgba(0,224,255,0.1)] hover:shadow-[0_0_40px_rgba(0,224,255,0.2)] hover:border-cyan-400 focus-within:border-cyan-400 focus-within:shadow-[0_0_40px_rgba(0,224,255,0.3)] transition-all duration-500 overflow-hidden group">
          <div className="flex gap-2 mb-4 border-b border-cyan-500/20 pb-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>

          <div className="flex-1 overflow-y-auto font-code text-sm text-cyan-400 flex flex-col gap-1 custom-scrollbar pr-2 pb-4">
            {history.map((line, i) => (
              <div key={i} className={
                line.includes('WARNING') || line.includes('ERROR') ? 'text-error' :
                line.includes('XP') || line.includes('SUCCESS') || line.includes('Complete') ? 'text-secondary-container' :
                line.includes('root@cyber-ops') ? 'text-white' : ''
              }>
                {line}
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          <div className="flex items-center gap-2 border-t border-cyan-500/20 pt-3">
            <span className="font-code text-cyan-400 text-sm">root@cyber-ops:~#</span>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent text-cyan-400 font-code text-sm outline-none border-none placeholder-cyan-400/30"
              placeholder="Type command..."
            />
          </div>
        </div>

      </div>
    </div>
  );
}
