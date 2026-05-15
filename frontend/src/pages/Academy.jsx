import React, { useState, useMemo } from 'react';
import { Database, Lock, Zap, Shield, Crosshair, Cpu, Eye, Wifi, Bug, Terminal, Server, Globe, Radio, KeyRound, Flame, Heart, Swords, Brain, Sparkles, Target, BookOpen, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';

// ─── Skill Tree Data ──────────────────────────────────────────────
// 3 branches: OFFENSIVE (red), DEFENSIVE (cyan), INTELLIGENCE (fuchsia)
// Each branch has tiers 1-5; core skills (shared) at the top

const SKILL_DATA = {
  'core-1': { name: 'Linux Basics', desc: 'Master terminal fundamentals and filesystem navigation.', icon: 'Terminal', branch: 'core', tier: 0, x: 50, y: 6, requires: [], lvl: 1, cost: 1 },
  'core-2': { name: 'Networking 101', desc: 'Understand TCP/IP, DNS, HTTP protocols and packet flow.', icon: 'Wifi', branch: 'core', tier: 0, x: 35, y: 13, requires: ['core-1'], lvl: 2, cost: 1 },
  'core-3': { name: 'Scripting', desc: 'Automate tasks with Bash and Python scripting.', icon: 'Cpu', branch: 'core', tier: 0, x: 65, y: 13, requires: ['core-1'], lvl: 2, cost: 1 },
  'off-1': { name: 'Recon & OSINT', desc: 'Gather intelligence on targets using open-source tools and footprinting.', icon: 'Eye', branch: 'offense', tier: 1, x: 18, y: 24, requires: ['core-2'], lvl: 4, cost: 1 },
  'off-2': { name: 'Vuln Scanning', desc: 'Identify weaknesses with Nmap, Nessus, and custom scanners.', icon: 'Bug', branch: 'offense', tier: 2, x: 12, y: 36, requires: ['off-1'], lvl: 6, cost: 2 },
  'off-3': { name: 'Exploitation', desc: 'Leverage Metasploit and manual exploits to gain system access.', icon: 'Crosshair', branch: 'offense', tier: 2, x: 26, y: 36, requires: ['off-1'], lvl: 7, cost: 2 },
  'off-4': { name: 'Web App Attacks', desc: 'Master XSS, SQLi, CSRF and SSRF attack vectors.', icon: 'Globe', branch: 'offense', tier: 3, x: 8, y: 49, requires: ['off-2'], lvl: 9, cost: 3 },
  'off-5': { name: 'Privilege Escalation', desc: 'Escalate from user to root using kernel exploits and misconfigs.', icon: 'Flame', branch: 'offense', tier: 3, x: 22, y: 49, requires: ['off-3'], lvl: 10, cost: 3 },
  'off-6': { name: 'Post-Exploitation', desc: 'Maintain persistence, lateral movement, and data exfiltration.', icon: 'Radio', branch: 'offense', tier: 4, x: 12, y: 62, requires: ['off-4', 'off-5'], lvl: 13, cost: 3 },
  'off-7': { name: 'Zero-Day Research', desc: 'Discover and weaponize unknown vulnerabilities. Elite tier.', icon: 'Sparkles', branch: 'offense', tier: 5, x: 18, y: 76, requires: ['off-6'], lvl: 18, cost: 4 },
  'def-1': { name: 'Firewall Config', desc: 'Configure iptables, UFW, and enterprise-grade firewall policies.', icon: 'Shield', branch: 'defense', tier: 1, x: 82, y: 24, requires: ['core-3'], lvl: 4, cost: 1 },
  'def-2': { name: 'IDS/IPS Systems', desc: 'Deploy Snort, Suricata, and anomaly detection for real-time monitoring.', icon: 'Eye', branch: 'defense', tier: 2, x: 76, y: 36, requires: ['def-1'], lvl: 6, cost: 2 },
  'def-3': { name: 'Log Analysis', desc: 'Parse and correlate logs with SIEM tools to detect intrusions.', icon: 'Server', branch: 'defense', tier: 2, x: 90, y: 36, requires: ['def-1'], lvl: 7, cost: 2 },
  'def-4': { name: 'Incident Response', desc: 'Contain, eradicate, and recover from active security breaches.', icon: 'Swords', branch: 'defense', tier: 3, x: 78, y: 49, requires: ['def-2'], lvl: 9, cost: 3 },
  'def-5': { name: 'Hardening', desc: 'Secure OS, services, and infrastructure against known attack vectors.', icon: 'Lock', branch: 'defense', tier: 3, x: 92, y: 49, requires: ['def-3'], lvl: 10, cost: 3 },
  'def-6': { name: 'Threat Hunting', desc: 'Proactively search for advanced persistent threats in networks.', icon: 'Crosshair', branch: 'defense', tier: 4, x: 86, y: 62, requires: ['def-4', 'def-5'], lvl: 13, cost: 3 },
  'def-7': { name: 'SOC Architect', desc: 'Design and lead a Security Operations Center. Elite tier.', icon: 'Database', branch: 'defense', tier: 5, x: 82, y: 76, requires: ['def-6'], lvl: 18, cost: 4 },
  'int-1': { name: 'Cryptography', desc: 'Symmetric, asymmetric encryption, hashing, and digital signatures.', icon: 'KeyRound', branch: 'intel', tier: 1, x: 50, y: 24, requires: ['core-2', 'core-3'], lvl: 5, cost: 1 },
  'int-2': { name: 'Malware Analysis', desc: 'Reverse-engineer trojans, ransomware, and rootkits in sandboxes.', icon: 'Bug', branch: 'intel', tier: 2, x: 42, y: 36, requires: ['int-1'], lvl: 7, cost: 2 },
  'int-3': { name: 'Forensics', desc: 'Recover evidence from disk images, memory dumps, and network captures.', icon: 'Database', branch: 'intel', tier: 2, x: 58, y: 36, requires: ['int-1'], lvl: 7, cost: 2 },
  'int-4': { name: 'Reverse Engineering', desc: 'Decompile and analyze binaries with IDA Pro, Ghidra, and radare2.', icon: 'Cpu', branch: 'intel', tier: 3, x: 42, y: 49, requires: ['int-2'], lvl: 10, cost: 3 },
  'int-5': { name: 'Threat Intelligence', desc: 'Collect, process, and operationalize CTI feeds and IOCs.', icon: 'Brain', branch: 'intel', tier: 3, x: 58, y: 49, requires: ['int-3'], lvl: 10, cost: 3 },
  'int-6': { name: 'APT Emulation', desc: 'Simulate nation-state adversary TTPs for purple team exercises.', icon: 'Flame', branch: 'intel', tier: 4, x: 50, y: 62, requires: ['int-4', 'int-5'], lvl: 14, cost: 3 },
  'int-7': { name: 'Cyber Strategist', desc: 'Architect full-spectrum cyber warfare campaigns. Elite tier.', icon: 'Sparkles', branch: 'intel', tier: 5, x: 50, y: 76, requires: ['int-6'], lvl: 18, cost: 4 },
};

const BRANCH_COLORS = {
  core: { text: 'text-white', bg: 'bg-white/10', border: 'border-white/30', glow: 'rgba(255,255,255,0.5)', line: '#ffffff' },
  offense: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/40', glow: 'rgba(248,113,113,0.6)', line: '#f87171' },
  defense: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-500/40', glow: 'rgba(0,224,255,0.6)', line: '#22d3ee' },
  intel: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'border-fuchsia-500/40', glow: 'rgba(217,70,239,0.6)', line: '#d946ef' },
};

const ICON_MAP = { Terminal, Wifi, Cpu, Eye, Bug, Crosshair, Globe, Flame, Radio, Sparkles, Shield, Server, Lock, Swords, KeyRound, Database, Brain };

export default function Academy() {
  const agentInfo = useStore(s => s.agentInfo);
  const skillPoints = useStore(s => s.skillPoints);
  const unlockedSkills = useStore(s => s.unlockedSkills);
  const unlockSkill = useStore(s => s.unlockSkill);
  const xpLog = useStore(s => s.xpLog) || [];
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const canUnlock = (id) => {
    if (unlockedSkills.includes(id)) return false;
    const skill = SKILL_DATA[id];
    if (skillPoints < skill.cost) return false;
    if (agentInfo.level < skill.lvl) return false;
    return skill.requires.every(r => unlockedSkills.includes(r));
  };

  const getStatus = (id) => {
    if (unlockedSkills.includes(id)) return 'unlocked';
    if (canUnlock(id)) return 'available';
    return 'locked';
  };

  // Build connection lines from requires
  const connections = useMemo(() => {
    const lines = [];
    Object.entries(SKILL_DATA).forEach(([id, skill]) => {
      skill.requires.forEach(reqId => {
        const from = SKILL_DATA[reqId];
        if (from) lines.push({ fromId: reqId, toId: id, x1: from.x, y1: from.y, x2: skill.x, y2: skill.y, branch: skill.branch });
      });
    });
    return lines;
  }, []);

  const sel = selected ? SKILL_DATA[selected] : null;
  const selStatus = selected ? getStatus(selected) : null;

  return (
    <div className="p-4 md:p-8 flex flex-col gap-4 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-cyan-500/20 pb-4 gap-3">
        <div>
          <h1 className="text-2xl text-secondary-container font-h1 flex items-center gap-2">
            <Database /> SKILL_TREE
          </h1>
          <p className="text-gray-400 font-body text-sm">Choose your specialization path. Unlock nodes to evolve your capabilities.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/15 border border-amber-500/40 font-code text-sm rounded-lg hover:bg-amber-900/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span className="text-amber-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">{skillPoints}</span>
            <span className="text-amber-400/60 text-[10px] tracking-widest">SP</span>
          </div>
          <div className="px-3 py-2 border border-surface-variant font-code text-xs text-gray-400">
            LVL {agentInfo.level} — {unlockedSkills.length}/{Object.keys(SKILL_DATA).length} UNLOCKED
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">

        {/* ─── Main Skill Tree Canvas ─── */}
        <div className="flex-1 glass-panel border border-cyan-500/15 relative overflow-auto custom-scrollbar" style={{ minHeight: '600px' }}>
          {/* Branch labels */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 font-code text-[10px]">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]"></div><span className="text-red-400">OFFENSIVE</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,224,255,0.8)]"></div><span className="text-cyan-400">DEFENSIVE</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(217,70,239,0.8)]"></div><span className="text-fuchsia-400">INTELLIGENCE</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.5)]"></div><span className="text-gray-400">CORE</span></div>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 85">
            <defs>
              <filter id="glow-line">
                <feGaussianBlur stdDeviation="0.3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {connections.map((c, i) => {
              const bothUnlocked = unlockedSkills.includes(c.fromId) && unlockedSkills.includes(c.toId);
              const oneUnlocked = unlockedSkills.includes(c.fromId);
              const color = BRANCH_COLORS[c.branch]?.line || '#444';
              return (
                <line
                  key={i}
                  x1={c.x1} y1={c.y1}
                  x2={c.x2} y2={c.y2}
                  stroke={bothUnlocked ? color : oneUnlocked ? color : '#2a2f38'}
                  strokeWidth={bothUnlocked ? 0.35 : 0.2}
                  strokeDasharray={bothUnlocked ? 'none' : '0.8 0.5'}
                  opacity={bothUnlocked ? 0.8 : oneUnlocked ? 0.4 : 0.2}
                  filter={bothUnlocked ? 'url(#glow-line)' : 'none'}
                />
              );
            })}
          </svg>

          {/* Skill Nodes */}
          {Object.entries(SKILL_DATA).map(([id, skill]) => {
            const status = getStatus(id);
            const bc = BRANCH_COLORS[skill.branch];
            const IconComp = ICON_MAP[skill.icon] || Zap;
            const isHovered = hoveredId === id;
            const isSelected = selected === id;

            return (
              <button
                key={id}
                className="absolute z-10 flex flex-col items-center group transition-all duration-300"
                style={{ left: `${skill.x}%`, top: `${skill.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setSelected(selected === id ? null : id)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Node circle */}
                <div className={`
                  relative w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300
                  ${status === 'unlocked'
                    ? `${bc.bg} ${bc.border} shadow-[0_0_15px_${bc.glow}]`
                    : status === 'available'
                      ? `bg-black/60 ${bc.border} border-dashed animate-pulse`
                      : 'bg-black/40 border-gray-700/50 opacity-40'
                  }
                  ${isSelected ? `ring-2 ring-offset-2 ring-offset-[#10141a] ${bc.border} scale-125` : ''}
                  ${status !== 'locked' ? 'hover:scale-125 cursor-pointer' : 'cursor-not-allowed'}
                `}>
                  {status === 'unlocked' && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ backgroundColor: bc.line }}></div>
                  )}
                  <IconComp size={18} className={status === 'unlocked' ? bc.text : status === 'available' ? bc.text + ' opacity-70' : 'text-gray-600'} />
                  {status === 'locked' && <Lock size={8} className="absolute -bottom-0.5 -right-0.5 text-gray-500" />}
                </div>

                {/* Name label */}
                <div className={`
                  font-code text-[9px] md:text-[10px] mt-1.5 text-center leading-tight max-w-[80px] whitespace-nowrap truncate transition-colors
                  ${status === 'unlocked' ? bc.text : status === 'available' ? 'text-gray-300' : 'text-gray-600'}
                `}>
                  {skill.name}
                </div>

                {/* Hover tooltip (brief) */}
                {isHovered && !isSelected && (
                  <div className="absolute -top-8 bg-black/90 backdrop-blur-md border border-cyan-500/30 px-2 py-1 font-code text-[9px] text-gray-300 whitespace-nowrap z-50 shadow-[0_0_15px_rgba(0,0,0,1)]" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                    LVL {skill.lvl} — {status === 'unlocked' ? '✓ UNLOCKED' : status === 'available' ? '◆ AVAILABLE' : '🔒 LOCKED'}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Side Panel: Skill Details ─── */}
        <div className="lg:w-80 flex-shrink-0 glass-panel border border-cyan-500/15 flex flex-col overflow-hidden">
          {sel ? (() => {
            const bc = BRANCH_COLORS[sel.branch];
            const IconComp = ICON_MAP[sel.icon] || Zap;
            const branchLabel = sel.branch === 'offense' ? 'OFFENSIVE' : sel.branch === 'defense' ? 'DEFENSIVE' : sel.branch === 'intel' ? 'INTELLIGENCE' : 'CORE';
            return (
              <>
                {/* Header */}
                <div className={`p-5 border-b border-cyan-500/15 bg-gradient-to-r ${sel.branch === 'offense' ? 'from-red-900/20' : sel.branch === 'defense' ? 'from-cyan-900/20' : sel.branch === 'intel' ? 'from-fuchsia-900/20' : 'from-white/5'} to-transparent`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-full ${bc.bg} ${bc.border} border-2 flex items-center justify-center`}>
                      <IconComp size={24} className={bc.text} />
                    </div>
                    <div>
                      <h3 className="font-code text-white text-sm font-bold">{sel.name}</h3>
                      <span className={`font-code text-[10px] ${bc.text}`}>{branchLabel} — TIER {sel.tier}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 font-body text-sm leading-relaxed">{sel.desc}</p>
                </div>

                {/* Stats */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="flex justify-between items-center font-code text-xs">
                    <span className="text-gray-500">REQUIRED LEVEL</span>
                    <span className={agentInfo.level >= sel.lvl ? 'text-secondary-container' : 'text-red-400'}>{sel.lvl} {agentInfo.level >= sel.lvl ? '✓' : `(need ${sel.lvl - agentInfo.level} more)`}</span>
                  </div>
                  <div className="flex justify-between items-center font-code text-xs">
                    <span className="text-gray-500">COST</span>
                    <span className="text-amber-400 flex items-center gap-1"><Sparkles size={10} /> {sel.cost} SP</span>
                  </div>
                  <div className="flex justify-between items-center font-code text-xs">
                    <span className="text-gray-500">STATUS</span>
                    <span className={selStatus === 'unlocked' ? 'text-secondary-container' : selStatus === 'available' ? 'text-cyan-400' : 'text-gray-500'}>
                      {selStatus === 'unlocked' ? '● ACTIVE' : selStatus === 'available' ? '◆ READY' : '○ LOCKED'}
                    </span>
                  </div>
                  {sel.requires.length > 0 && (
                    <div>
                      <div className="font-code text-[10px] text-gray-500 mb-2">PREREQUISITES</div>
                      <div className="flex flex-wrap gap-1.5">
                        {sel.requires.map(rId => (
                          <span key={rId} className={`font-code text-[10px] px-2 py-0.5 border ${unlockedSkills.includes(rId) ? 'border-secondary-container/40 text-secondary-container bg-secondary-container/5' : 'border-red-500/40 text-red-400 bg-red-400/5'}`}>
                            {SKILL_DATA[rId]?.name || rId} {unlockedSkills.includes(rId) ? '✓' : '✗'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="p-4 border-t border-cyan-500/15">
                  {selStatus === 'unlocked' ? (
                    <div className="w-full py-3 border border-secondary-container/30 text-secondary-container font-code text-xs tracking-widest text-center bg-secondary-container/5">✓ SKILL ACQUIRED</div>
                  ) : selStatus === 'available' ? (
                    <button
                      onClick={() => { unlockSkill(selected, sel.cost); }}
                      className="w-full py-3 bg-cyan-400 text-black font-code text-xs tracking-widest font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(0,224,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={14} /> UNLOCK ({sel.cost} SP)
                    </button>
                  ) : (
                    <div className="w-full py-3 border border-gray-700 text-gray-500 font-code text-xs tracking-widest text-center">
                      <Lock size={12} className="inline mr-2" />REQUIREMENTS NOT MET
                    </div>
                  )}
                </div>
              </>
            );
          })() : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-400/5 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Zap size={24} className="text-cyan-400/40" />
              </div>
              <h3 className="font-code text-sm text-gray-400 mb-2">SELECT A NODE</h3>
              <p className="font-body text-xs text-gray-600 leading-relaxed">Click on any skill node on the tree to view details, prerequisites, and unlock options.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── XP Sources Panel ─── */}
      <div className="glass-panel border border-cyan-500/15 p-5">
        <h3 className="font-code text-sm text-cyan-400 tracking-widest mb-4 flex items-center gap-2 border-b border-cyan-500/15 pb-3">
          <Trophy size={16} className="text-amber-400" /> XP SOURCES — HOW TO EARN SKILL POINTS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="p-4 border border-cyan-500/20 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-code text-xs text-cyan-400 font-bold">MISSIONS</span>
            </div>
            <p className="font-body text-[11px] text-gray-400 leading-relaxed">Complete terminal missions to earn 25-100 XP per task.</p>
            <div className="font-code text-[10px] text-cyan-400/60 mt-2">+25-100 XP</div>
          </div>
          <div className="p-4 border border-red-500/20 bg-red-400/5 hover:bg-red-400/10 hover:border-red-400/50 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
              <span className="font-code text-xs text-red-400 font-bold">RAIDS</span>
            </div>
            <p className="font-body text-[11px] text-gray-400 leading-relaxed">Participate in global raids for massive 100-500 XP rewards.</p>
            <div className="font-code text-[10px] text-red-400/60 mt-2">+100-500 XP</div>
          </div>
          <div className="p-4 border border-fuchsia-500/20 bg-fuchsia-400/5 hover:bg-fuchsia-400/10 hover:border-fuchsia-400/50 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <Swords size={16} className="text-fuchsia-400 group-hover:scale-110 transition-transform" />
              <span className="font-code text-xs text-fuchsia-400 font-bold">PVP</span>
            </div>
            <p className="font-body text-[11px] text-gray-400 leading-relaxed">Defend against intrusions or hack rivals for 50-150 XP.</p>
            <div className="font-code text-[10px] text-fuchsia-400/60 mt-2">+50-150 XP</div>
          </div>
          <div className="p-4 border border-secondary-container/20 bg-secondary-container/5 hover:bg-secondary-container/10 hover:border-secondary-container/50 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-secondary-container group-hover:scale-110 transition-transform" />
              <span className="font-code text-xs text-secondary-container font-bold">TEXTBOOKS</span>
            </div>
            <p className="font-body text-[11px] text-gray-400 leading-relaxed">Study cybersec books — each chapter gives 20-50 XP.</p>
            <div className="font-code text-[10px] text-secondary-container/60 mt-2">+20-50 XP/chapter</div>
          </div>
        </div>
        <div className="border-t border-cyan-500/10 pt-3 flex items-center gap-2">
          <Zap size={12} className="text-amber-400" />
          <span className="font-code text-[10px] text-gray-500">Every level-up grants <span className="text-amber-400 font-bold">+2 SKILL POINTS</span>. XP requirement scales by 15% per level.</span>
        </div>

        {/* Recent XP Activity */}
        {xpLog.length > 0 && (
          <div className="mt-4 border-t border-cyan-500/10 pt-3">
            <div className="font-code text-[10px] text-gray-500 tracking-widest mb-2">RECENT XP ACTIVITY</div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
              {xpLog.slice(0, 8).map((entry, i) => {
                const sourceColors = { mission: 'text-cyan-400', raid: 'text-red-400', pvp: 'text-fuchsia-400', textbook: 'text-secondary-container' };
                const sourceIcons = { mission: '⚡', raid: '🎯', pvp: '⚔️', textbook: '📖' };
                const ago = Math.round((Date.now() - entry.timestamp) / 60000);
                return (
                  <div key={i} className="flex items-center justify-between font-code text-[10px] py-1 px-2 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <span className="flex items-center gap-2">
                      <span>{sourceIcons[entry.source] || '⚡'}</span>
                      <span className={sourceColors[entry.source] || 'text-gray-400'}>{entry.label}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-secondary-container font-bold">+{entry.xp} XP</span>
                      <span className="text-gray-600">{ago < 1 ? 'now' : `${ago}m ago`}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
