import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Trophy, Target, Award, Activity, Shield, Crosshair, Cpu, Wifi,
  AlertTriangle, TrendingUp, Zap, Eye, Terminal, Server, Clock,
  ChevronRight, ArrowUpRight, Lock, Globe, Users, Database, Flame,
  BarChart3, Layers, Radio, BookOpen
} from 'lucide-react';

// ── Helpers ──
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── Fake live threat feed data ──
const THREAT_FEED = [
  { id: 1, type: 'CRITICAL', msg: 'SQL Injection attempt on /api/auth', src: '45.33.xx.xx', time: '2s ago', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/5' },
  { id: 2, type: 'WARNING', msg: 'Brute-force detected on SSH port 22', src: '192.168.xx.xx', time: '14s ago', color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/5' },
  { id: 3, type: 'INFO', msg: 'Firewall rule updated — port 443 whitelisted', src: 'SYSTEM', time: '1m ago', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5' },
  { id: 4, type: 'CRITICAL', msg: 'XSS payload intercepted in form input', src: '103.21.xx.xx', time: '3m ago', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/5' },
  { id: 5, type: 'INFO', msg: 'TLS certificate renewed for *.cyber-ops.net', src: 'CERTBOT', time: '8m ago', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5' },
  { id: 6, type: 'WARNING', msg: 'Unusual outbound traffic spike on port 8080', src: '10.0.xx.xx', time: '12m ago', color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/5' },
];

// ── Activity heatmap (last 12 weeks, 7 days each) ──
const generateHeatmap = () => Array.from({ length: 12 }, () => Array.from({ length: 7 }, () => rand(0, 4)));

// ── XP Progress Ring SVG ──
function ProgressRing({ radius, stroke, progress, color = '#00e0ff' }) {
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle stroke="rgba(255,255,255,0.06)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <circle stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-out' }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} />
    </svg>
  );
}

export default function Dashboard() {
  const agentInfo = useStore(state => state.agentInfo);
  const unlockedSkills = useStore(state => state.unlockedSkills);
  const navigate = useNavigate();

  const heatmap = useMemo(generateHeatmap, []);

  // Animated counters
  const [counters, setCounters] = useState({ threats: 0, uptime: 0, packets: 0 });
  useEffect(() => {
    const targets = { threats: 892, uptime: 99.97, packets: 14720 };
    let step = 0;
    const id = setInterval(() => {
      step++;
      const p = Math.min(step / 50, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCounters({ threats: Math.floor(targets.threats * e), uptime: parseFloat((targets.uptime * e).toFixed(2)), packets: Math.floor(targets.packets * e) });
      if (step >= 50) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, []);

  // Simulated live pulse
  const [pulse, setPulse] = useState(true);
  useEffect(() => { const id = setInterval(() => setPulse(p => !p), 2000); return () => clearInterval(id); }, []);

  const xpPercent = Math.round((agentInfo.xp / agentInfo.nextLevelXp) * 100);

  const heatColors = ['bg-gray-800', 'bg-cyan-900/60', 'bg-cyan-700/60', 'bg-cyan-500/70', 'bg-cyan-400'];

  const quickActions = [
    { icon: <Crosshair size={20} />, label: 'MISSIONS', sub: '3 active contracts', path: '/missions', color: 'cyan' },
    { icon: <Database size={20} />, label: 'SKILL TREE', sub: `${unlockedSkills.length} nodes unlocked`, path: '/academy', color: 'fuchsia' },
    { icon: <Shield size={20} />, label: 'ARMORY', sub: 'New gear available', path: '/armory', color: 'secondary-container' },
    { icon: <BookOpen size={20} />, label: 'TEXTBOOKS', sub: 'Learn hacking', path: '/textbooks', color: 'cyan' },
  ];

  const colorStyles = {
    cyan: { border: 'border-cyan-500/30', hover: 'hover:border-cyan-400', text: 'text-cyan-400', bg: 'bg-cyan-400/5', glow: 'hover:shadow-[0_0_25px_rgba(0,224,255,0.12)]' },
    fuchsia: { border: 'border-fuchsia-500/30', hover: 'hover:border-fuchsia-400', text: 'text-fuchsia-400', bg: 'bg-fuchsia-400/5', glow: 'hover:shadow-[0_0_25px_rgba(217,70,239,0.12)]' },
    'secondary-container': { border: 'border-secondary-container/30', hover: 'hover:border-secondary-container', text: 'text-secondary-container', bg: 'bg-secondary-container/5', glow: 'hover:shadow-[0_0_25px_rgba(195,244,0,0.12)]' },
  };

  return (
    <div className="p-4 md:p-8 space-y-6 w-full animate-page-enter">

      {/* ══════ TOP METRICS ROW ══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AGENT LEVEL', value: agentInfo.level, icon: <Zap size={18} />, color: 'text-cyan-400', glow: 'rgba(0,224,255,0.6)' },
          { label: 'THREATS BLOCKED', value: counters.threats.toLocaleString(), icon: <Shield size={18} />, color: 'text-red-400', glow: 'rgba(248,113,113,0.6)' },
          { label: 'PACKETS ANALYZED', value: counters.packets.toLocaleString(), icon: <Activity size={18} />, color: 'text-secondary-container', glow: 'rgba(195,244,0,0.6)' },
          { label: 'SYSTEM UPTIME', value: `${counters.uptime}%`, icon: <Server size={18} />, color: 'text-fuchsia-400', glow: 'rgba(217,70,239,0.6)' },
        ].map((m, i) => (
          <div key={i} className="glass-panel border border-cyan-500/15 p-4 flex items-center gap-4 group hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,224,255,0.08)] cursor-default">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color} bg-current/10 group-hover:scale-110 transition-transform`} style={{ backgroundColor: `${m.glow.replace('0.6', '0.08')}` }}>
              {m.icon}
            </div>
            <div>
              <div className={`font-code text-xl font-bold ${m.color} group-hover:drop-shadow-[0_0_10px_${m.glow}] transition-all`}>{m.value}</div>
              <div className="font-code text-[9px] text-gray-500 tracking-widest">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════ MAIN GRID ══════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN (8 cols) ── */}
        <div className="xl:col-span-8 flex flex-col gap-6">

          {/* LIVE THREAT FEED */}
          <div className="glass-panel border border-red-500/20 overflow-hidden group transition-all duration-300 hover:border-red-500/40">
            <header className="bg-red-900/15 border-b border-red-500/20 p-4 flex items-center justify-between">
              <h3 className="font-code text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle size={16} className={pulse ? 'animate-pulse' : ''} /> LIVE THREAT INTELLIGENCE FEED
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-red-400' : 'bg-red-800'} transition-colors`}></div>
                <span className="font-code text-[9px] text-red-400/70 tracking-widest">MONITORING</span>
              </div>
            </header>
            <div className="divide-y divide-red-500/10 max-h-[280px] overflow-y-auto custom-scrollbar">
              {THREAT_FEED.map(t => (
                <div key={t.id} className={`flex items-start gap-3 p-3 ${t.bg} hover:bg-white/[0.02] transition-colors cursor-default`}>
                  <span className={`font-code text-[9px] px-1.5 py-0.5 border ${t.border} ${t.color} font-bold flex-shrink-0 mt-0.5`}>{t.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-code text-xs text-white truncate">{t.msg}</div>
                    <div className="font-code text-[9px] text-gray-500 mt-0.5">SRC: {t.src} · {t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DAILY CONTRACTS */}
          <div className="glass-panel border border-secondary-container/20 p-6 relative overflow-hidden group transition-all duration-500 hover:border-secondary-container/50">
            <div className="absolute top-0 right-0 p-2 bg-secondary-container/20 border-b border-l border-secondary-container text-secondary-container text-[10px] font-code font-bold group-hover:bg-secondary-container/40 transition-colors">DAILY REFRESH: 04:12:09</div>
            <h3 className="font-h3 text-secondary-container mb-4 flex items-center gap-2">
              <Target size={18} className="group-hover:animate-spin" /> SYNDICATE CONTRACTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Contract 1 */}
              <div className="bg-black/50 border border-surface-variant p-4 flex flex-col hover:border-secondary-container/80 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(195,244,0,0.1)] transition-all duration-300 cursor-pointer group/card">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-code text-white text-sm group-hover/card:text-secondary-container transition-colors">BREACH PROTOCOL</h4>
                  <span className="bg-secondary-container/20 text-secondary-container text-[9px] px-2 py-1 font-bold group-hover/card:animate-pulse">IN PROGRESS</span>
                </div>
                <p className="text-[10px] text-gray-400 font-body flex-1">Successfully bypass 3 Level-1 firewalls in the operations terminal.</p>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-code text-gray-500 mb-1"><span>PROGRESS: 1/3</span><span className="group-hover/card:text-secondary-container transition-colors">33%</span></div>
                  <div className="w-full h-1 bg-surface-variant"><div className="h-full bg-secondary-container w-[33%] group-hover/card:shadow-[0_0_10px_rgba(195,244,0,0.8)] transition-all"></div></div>
                  <div className="text-secondary-container text-xs font-code mt-2 flex items-center gap-1"><Award size={12}/> REWARD: 500 XP</div>
                </div>
              </div>
              {/* Contract 2 */}
              <div className="bg-black/50 border border-surface-variant p-4 flex flex-col hover:border-cyan-400 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,224,255,0.15)] transition-all duration-300 cursor-pointer group/card">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-code text-white text-sm group-hover/card:text-cyan-400 transition-colors">SYSTEM DEFENDER</h4>
                  <span className="bg-cyan-400/20 text-cyan-400 text-[9px] px-2 py-1 font-bold">COMPLETED</span>
                </div>
                <p className="text-[10px] text-gray-400 font-body flex-1">Log in for 3 consecutive days to stabilize your neural link.</p>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-code text-gray-500 mb-1"><span>PROGRESS: 3/3</span><span className="group-hover/card:text-cyan-400">100%</span></div>
                  <div className="w-full h-1 bg-surface-variant"><div className="h-full bg-cyan-400 w-[100%] shadow-[0_0_10px_#00e0ff]"></div></div>
                  <button className="w-full mt-2 bg-cyan-400 text-black font-code text-[10px] py-1 hover:bg-white hover:shadow-[0_0_15px_rgba(0,224,255,0.8)] active:scale-95 transition-all font-bold">CLAIM ₿ 150.00</button>
                </div>
              </div>
              {/* Contract 3 */}
              <div className="bg-black/50 border border-surface-variant p-4 flex flex-col hover:border-error/50 transition-all cursor-pointer opacity-70">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-code text-white text-sm">BLACK MARKET BUYER</h4>
                  <span className="bg-surface-variant/20 text-gray-400 text-[9px] px-2 py-1 font-bold">NOT STARTED</span>
                </div>
                <p className="text-[10px] text-gray-400 font-body flex-1">Purchase any utility or zero-day exploit from the Armory.</p>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-code text-gray-500 mb-1"><span>PROGRESS: 0/1</span><span>0%</span></div>
                  <div className="w-full h-1 bg-surface-variant"></div>
                  <div className="text-secondary-container text-xs font-code mt-2 flex items-center gap-1"><Award size={12}/> REWARD: EXCLUSIVE BADGE</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVITY HEATMAP */}
          <div className="glass-panel border border-cyan-500/15 p-5 group transition-all duration-300 hover:border-cyan-400/30">
            <h3 className="font-code text-sm text-cyan-400 mb-4 flex items-center gap-2">
              <BarChart3 size={16} /> OPERATION ACTIVITY — LAST 12 WEEKS
            </h3>
            <div className="flex gap-[3px]">
              {heatmap.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px] flex-1">
                  {week.map((val, di) => (
                    <div key={di} className={`aspect-square rounded-[2px] ${heatColors[val]} hover:ring-1 hover:ring-cyan-400/50 transition-all cursor-default`} title={`Week ${wi + 1}, Day ${di + 1}: ${val} ops`}></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-3 font-code text-[9px] text-gray-500">
              <span>LESS</span>
              {heatColors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`}></div>)}
              <span>MORE</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (4 cols) ── */}
        <div className="xl:col-span-4 flex flex-col gap-6">

          {/* XP PROGRESS RING */}
          <div className="glass-panel border border-cyan-500/15 p-6 flex flex-col items-center gap-4 group transition-all duration-300 hover:border-cyan-400/40">
            <div className="relative">
              <ProgressRing radius={70} stroke={6} progress={xpPercent} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-code text-2xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,224,255,0.5)]">{xpPercent}%</span>
                <span className="font-code text-[9px] text-gray-500 tracking-widest">TO LVL {agentInfo.level + 1}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="font-code text-xs text-gray-400">{agentInfo.xp.toLocaleString()} / {agentInfo.nextLevelXp.toLocaleString()} XP</div>
              <div className="font-code text-[9px] text-gray-600 mt-1">{(agentInfo.nextLevelXp - agentInfo.xp).toLocaleString()} XP REMAINING</div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="space-y-3">
            <h3 className="font-code text-xs text-gray-500 tracking-widest px-1">QUICK ACCESS</h3>
            {quickActions.map((a, i) => {
              const cs = colorStyles[a.color];
              return (
                <button key={i} onClick={() => navigate(a.path)} className={`w-full glass-panel border ${cs.border} ${cs.hover} ${cs.glow} p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 group/qa text-left`}>
                  <div className={`w-10 h-10 rounded-lg ${cs.bg} ${cs.text} flex items-center justify-center group-hover/qa:scale-110 transition-transform`}>{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-code text-xs ${cs.text} tracking-widest`}>{a.label}</div>
                    <div className="font-code text-[9px] text-gray-500 mt-0.5">{a.sub}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-600 group-hover/qa:text-white group-hover/qa:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>

          {/* LEADERBOARD */}
          <div className="glass-panel border border-cyan-500/15 flex flex-col overflow-hidden transition-all duration-300 hover:border-cyan-400/40 group">
            <header className="bg-cyan-900/20 border-b border-cyan-500/20 p-4 font-code text-sm text-cyan-400 flex items-center gap-2 group-hover:bg-cyan-900/40 transition-colors">
              <Trophy size={16} className="group-hover:scale-110 group-hover:text-cyan-300 transition-all"/> GLOBAL LEADERBOARD
            </header>
            <div className="p-4 flex flex-col gap-2">
              {[
                { rank: '#1', name: 'Neo', xp: '99,999', highlight: true },
                { rank: '#2', name: 'Trinity', xp: '85,420', highlight: false },
                { rank: '#3', name: 'Morpheus', xp: '72,100', highlight: false },
              ].map((p, i) => (
                <div key={i} className={`flex justify-between items-center p-3 border ${i === 0 ? 'border-cyan-500/30 bg-cyan-400/10' : 'border-surface-variant bg-surface-variant/30'} hover:scale-[1.03] hover:bg-cyan-400/15 transition-all cursor-default`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-code font-bold ${i === 0 ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,224,255,0.8)]' : 'text-gray-400'}`}>{p.rank}</span>
                    <span className="font-code text-white">{p.name}</span>
                  </div>
                  <span className="font-code text-secondary-container">{p.xp} XP</span>
                </div>
              ))}
              {/* You */}
              <div className="flex justify-between items-center p-3 border border-dashed border-cyan-500/30 mt-2 opacity-80 hover:opacity-100 hover:scale-[1.03] hover:bg-cyan-900/20 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <span className="font-code text-cyan-400 font-bold">#142</span>
                  <span className="font-code text-cyan-400 drop-shadow-[0_0_5px_rgba(0,224,255,0.5)]">{agentInfo.username} (YOU)</span>
                </div>
                <span className="font-code text-secondary-container">{agentInfo.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
