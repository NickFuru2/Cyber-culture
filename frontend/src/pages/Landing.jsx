import { useState, useEffect } from 'react';
import { Power, Terminal, Shield, Crosshair, Zap, Globe, Users, Target, ChevronRight, Activity, Lock, Eye, Cpu, ArrowRight, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Landing() {
  const navigate = useNavigate();
  const agentInfo = useStore(state => state.agentInfo);

  // Animated typing effect for terminal
  const terminalLines = [
    { text: 'root@cyber-ops:~# ./init_scan -t global', color: 'text-cyan-400', delay: 0 },
    { text: 'Initializing global threat matrix...', color: 'text-gray-400', delay: 600 },
    { text: '[██████████████████████████] 100%', color: 'text-secondary-container', delay: 1200 },
    { text: '', color: '', delay: 1500 },
    { text: '> 3 critical vulnerabilities detected in sector 7G', color: 'text-error', delay: 1800 },
    { text: '> WARNING: Unauthorized access attempt from 192.168.x.x', color: 'text-red-400', delay: 2400 },
    { text: '> Deploying countermeasures...', color: 'text-yellow-400', delay: 3000 },
    { text: '> Firewall reinforced. Threat neutralized.', color: 'text-secondary-container', delay: 3600 },
    { text: '', color: '', delay: 3900 },
    { text: 'root@cyber-ops:~# status --agents', color: 'text-cyan-400', delay: 4200 },
    { text: 'ACTIVE AGENTS: 2,642 | SECTORS SECURE: 87%', color: 'text-gray-300', delay: 4800 },
    { text: 'THREAT LEVEL: ████░░░░░░ ELEVATED', color: 'text-yellow-400', delay: 5200 },
  ];
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, line]), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animated counters
  const [counts, setCounts] = useState({ ops: 0, threats: 0, agents: 0, uptime: 0 });
  useEffect(() => {
    const targets = { ops: 14720, threats: 892, agents: 2642, uptime: 99.97 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        ops: Math.floor(targets.ops * ease),
        threats: Math.floor(targets.threats * ease),
        agents: Math.floor(targets.agents * ease),
        uptime: parseFloat((targets.uptime * ease).toFixed(2)),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Target size={24} />, title: 'LIVE MISSIONS', desc: 'Execute hyper-realistic cyber operations across dynamic threat scenarios with real-time tactical feedback.', color: 'cyan' },
    { icon: <Shield size={24} />, title: 'FACTION WARS', desc: 'Join White Hat or Black Hat forces. Compete for global sector dominance in persistent territory warfare.', color: 'secondary-container' },
    { icon: <Cpu size={24} />, title: 'SKILL EVOLUTION', desc: 'Master offensive & defensive cyber techniques through a branching skill tree with 200+ unlock nodes.', color: 'fuchsia' },
    { icon: <Users size={24} />, title: 'SYNDICATE OPS', desc: 'Form elite hacker squads. Coordinate raids, share intel, and climb the global leaderboard together.', color: 'cyan' },
    { icon: <Lock size={24} />, title: 'ARMORY ACCESS', desc: 'Acquire zero-day exploits, firewalls, and tactical gear from the black market trading system.', color: 'secondary-container' },
    { icon: <Activity size={24} />, title: 'GLOBAL RAIDS', desc: 'Participate in server-wide PvE events with massive rewards and limited-time legendary loot.', color: 'fuchsia' },
  ];

  const colorMap = {
    'cyan': { border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-400', bg: 'bg-cyan-400/5', hoverBg: 'hover:bg-cyan-400/10', text: 'text-cyan-400', shadow: 'hover:shadow-[0_0_30px_rgba(0,224,255,0.15)]', iconBg: 'bg-cyan-400/10', dot: 'bg-cyan-400' },
    'secondary-container': { border: 'border-secondary-container/30', hoverBorder: 'hover:border-secondary-container', bg: 'bg-secondary-container/5', hoverBg: 'hover:bg-secondary-container/10', text: 'text-secondary-container', shadow: 'hover:shadow-[0_0_30px_rgba(195,244,0,0.15)]', iconBg: 'bg-secondary-container/10', dot: 'bg-secondary-container' },
    'fuchsia': { border: 'border-fuchsia-500/30', hoverBorder: 'hover:border-fuchsia-400', bg: 'bg-fuchsia-400/5', hoverBg: 'hover:bg-fuchsia-400/10', text: 'text-fuchsia-400', shadow: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]', iconBg: 'bg-fuchsia-400/10', dot: 'bg-fuchsia-400' },
  };

  return (
    <div className="w-full overflow-hidden">

      {/* ══════════ HERO SECTION ══════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center w-full overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-900/25 via-background to-background z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-transparent to-transparent z-0"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(0,224,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,224,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse" style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.7}s`, animationDuration: `${2 + i * 0.5}s` }}></div>
          ))}
        </div>

        <div className="w-full max-w-7xl px-6 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 py-20">
          {/* Left: Hero Text */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="inline-block px-3 py-1.5 border border-cyan-500/30 bg-cyan-400/5 backdrop-blur-sm">
                <span className="font-code text-xs text-cyan-400 tracking-widest flex items-center gap-2">
                  <Radio size={12} className="animate-pulse" /> SYSTEM ONLINE // SECURE UPLINK ESTABLISHED
                </span>
              </div>
            </div>
            
            <h1 className="font-h1 text-5xl md:text-6xl xl:text-7xl text-white font-bold leading-[1.05]">
              MASTER THE ART OF<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-primary drop-shadow-[0_0_30px_rgba(0,224,255,0.4)]">CYBER WARFARE.</span>
            </h1>
            
            <p className="font-body text-lg text-gray-400 max-w-xl leading-relaxed">
              Engage in hyper-realistic combat simulations. Infiltrate secured networks. 
              Defend critical infrastructure. Elevate your tactical intelligence in a fully 
              immersive, gamified environment built for <span className="text-cyan-400 font-semibold">elite operatives</span>.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-cyan-400 text-slate-950 px-8 py-3.5 font-code tracking-widest font-bold hover:bg-white hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] transition-all duration-300 flex items-center gap-2 group active:scale-95"
              >
                <Power size={18}/> ENTER THE GRID
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/academy')}
                className="border border-cyan-500/50 text-cyan-400 px-8 py-3.5 font-code tracking-widest hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 flex items-center gap-2 group"
              >
                <Eye size={18}/> VIEW INTEL
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 md:gap-10 pt-8 border-t border-surface-variant/30 mt-4">
              <div className="group cursor-default">
                <div className="font-code text-3xl md:text-4xl text-cyan-400 font-bold group-hover:drop-shadow-[0_0_15px_rgba(0,224,255,0.8)] transition-all">{counts.agents.toLocaleString()}</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest mt-1">ACTIVE OPERATIVES</div>
              </div>
              <div className="group cursor-default">
                <div className="font-code text-3xl md:text-4xl text-secondary-container font-bold group-hover:drop-shadow-[0_0_15px_rgba(195,244,0,0.8)] transition-all">{counts.ops.toLocaleString()}</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest mt-1">MISSIONS COMPLETED</div>
              </div>
              <div className="group cursor-default">
                <div className="font-code text-3xl md:text-4xl text-error font-bold group-hover:drop-shadow-[0_0_15px_rgba(255,180,171,0.8)] transition-all">{counts.threats.toLocaleString()}</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest mt-1">THREATS NEUTRALIZED</div>
              </div>
              <div className="group cursor-default">
                <div className="font-code text-3xl md:text-4xl text-fuchsia-400 font-bold group-hover:drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] transition-all">{counts.uptime}%</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest mt-1">SYSTEM UPTIME</div>
              </div>
            </div>
          </div>
          
          {/* Right: Animated Terminal */}
          <div className="flex-1 relative w-full max-w-[550px]">
            {/* Glow behind terminal */}
            <div className="absolute -inset-4 bg-cyan-400/5 blur-3xl rounded-full z-0"></div>
            
            <div className="relative bg-[#0a0e14]/90 backdrop-blur-xl border border-cyan-500/20 overflow-hidden flex flex-col h-[420px] shadow-[0_0_60px_rgba(0,224,255,0.08)] z-10 hover:border-cyan-400/40 hover:shadow-[0_0_60px_rgba(0,224,255,0.15)] transition-all duration-500 group">
              {/* Terminal header */}
              <div className="h-9 border-b border-cyan-500/20 flex items-center px-4 justify-between bg-[#080c12]/80">
                <span className="font-code text-[10px] text-cyan-400 flex items-center gap-2">
                  <Terminal size={12} className="group-hover:animate-pulse" /> TERMINAL_EMULATOR_v4.2
                </span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
              </div>
              {/* Terminal body */}
              <div className="p-4 font-code text-[13px] flex-1 overflow-hidden space-y-1">
                {visibleLines.map((line, i) => (
                  <div key={i} className={`${line.color} ${i === visibleLines.length - 1 ? 'animate-[fadeIn_0.3s_ease-out]' : ''}`} style={{ opacity: line.text ? 1 : 0, minHeight: line.text ? 'auto' : '8px' }}>
                    {line.text}
                  </div>
                ))}
                <div className="text-cyan-400 animate-pulse mt-1">█</div>
              </div>
              {/* Terminal footer */}
              <div className="border-t border-cyan-500/10 px-4 py-2 flex justify-between items-center bg-black/30">
                <span className="font-code text-[9px] text-gray-600">SESSION: 0x7F2A | PID: 4821</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></div>
                  <span className="font-code text-[9px] text-gray-600">ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES GRID ══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="text-center mb-14">
          <div className="font-code text-xs text-cyan-400 tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-cyan-400/50"></div>
            CORE SYSTEMS
            <div className="w-8 h-px bg-cyan-400/50"></div>
          </div>
          <h2 className="font-h1 text-3xl md:text-4xl text-white font-bold">OPERATIONAL CAPABILITIES</h2>
          <p className="text-gray-500 font-body mt-3 max-w-lg mx-auto">Everything you need to become an elite cyber operative — from live combat simulations to strategic faction warfare.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div key={i} className={`glass-panel border ${c.border} ${c.hoverBorder} ${c.shadow} p-6 flex flex-col gap-4 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-default group`}>
                <div className={`w-12 h-12 ${c.iconBg} flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className={`font-code text-sm tracking-widest ${c.text}`}>{f.title}</h3>
                <p className="text-gray-400 font-body text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className={`flex items-center gap-1 font-code text-[10px] ${c.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  ACCESS MODULE <ChevronRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════ WORLD MAP PREVIEW ══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="relative overflow-hidden border border-cyan-500/20 group hover:border-cyan-400/40 transition-all duration-500" style={{ aspectRatio: '21/9' }}>
          <video autoPlay loop muted playsInline poster="/world-map-clean.png" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700">
            <source src="/world-map-clean.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#10141a] via-[#10141a]/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#10141a] via-transparent to-[#10141a]/30 z-10"></div>

          <div className="relative z-20 flex flex-col justify-center h-full p-8 md:p-12 max-w-lg">
            <div className="font-code text-[10px] text-cyan-400 tracking-widest mb-3 flex items-center gap-2">
              <Globe size={12} className="animate-pulse" /> REAL-TIME GLOBAL MONITORING
            </div>
            <h3 className="font-h1 text-2xl md:text-3xl text-white font-bold mb-3">FACTION TERRITORY MAP</h3>
            <p className="text-gray-400 font-body text-sm mb-6 leading-relaxed">Monitor live faction engagements across 16 global sectors. Track White Hat defenses and Black Hat incursions in real-time.</p>
            <button 
              onClick={() => navigate('/factions')}
              className="w-fit bg-cyan-400/10 border border-cyan-500/40 text-cyan-400 px-6 py-2.5 font-code text-xs tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center gap-2 group/btn active:scale-95"
            >
              <Crosshair size={14} /> OPEN THREAT MAP <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ CTA FOOTER ══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="relative border border-cyan-500/20 bg-gradient-to-r from-cyan-900/10 via-[#10141a] to-fuchsia-900/10 p-10 md:p-16 text-center overflow-hidden group hover:border-cyan-400/30 transition-all duration-500">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,224,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,224,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10">
            <div className="font-code text-xs text-cyan-400 tracking-[0.3em] mb-4">PRIORITY TRANSMISSION</div>
            <h2 className="font-h1 text-3xl md:text-4xl text-white font-bold mb-4">READY TO JOIN THE OPERATION?</h2>
            <p className="text-gray-400 font-body max-w-xl mx-auto mb-8">Your skills are needed. The grid doesn't defend itself. Initialize your agent sequence and begin your journey to the top of the leaderboard.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-cyan-400 text-slate-950 px-10 py-4 font-code tracking-widest font-bold text-lg hover:bg-white hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] transition-all duration-300 flex items-center gap-3 mx-auto group active:scale-95"
            >
              <Zap size={20} /> DEPLOY NOW <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8"></div>
    </div>
  );
}
