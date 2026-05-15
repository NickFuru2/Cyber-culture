import React, { useState, useEffect, useRef } from 'react';
import { Users, Activity, Crosshair, Shield, Globe, Zap, Radio, MapPin, AlertTriangle, ChevronDown, Eye } from 'lucide-react';

export default function Factions() {
  const [events, setEvents] = useState([
    { id: 1, time: '10:42', team: 'BLACK HAT', msg: 'Breached Secure Subnet Omega', type: 'attack' },
    { id: 2, time: '10:45', team: 'WHITE HAT', msg: 'Patched Vulnerability CVE-2026-11X', type: 'defend' },
    { id: 3, time: '10:50', team: 'BLACK HAT', msg: 'Deployed DDoS on Sector 7 Gateway', type: 'attack' },
    { id: 4, time: '10:53', team: 'WHITE HAT', msg: 'Firewall reinforced on Node Alpha-9', type: 'defend' },
    { id: 5, time: '10:58', team: 'BLACK HAT', msg: 'SQL Injection detected on Database Cluster', type: 'attack' },
    { id: 6, time: '11:02', team: 'WHITE HAT', msg: 'Intrusion neutralized — Agent KR-7 deployed', type: 'defend' },
  ]);

  const [mapMode, setMapMode] = useState('video'); // 'video' | 'static'
  const [activeHotspot, setActiveHotspot] = useState(null);
  const videoRef = useRef(null);

  // Simulated hotspots on the world map
  const hotspots = [
    // North America
    { id: 'na-east', label: 'NODE NA-EAST', x: '25%', y: '32%', status: 'defended', whiteHat: 68, blackHat: 32 },
    { id: 'na-west', label: 'NODE NA-WEST', x: '15%', y: '36%', status: 'contested', whiteHat: 52, blackHat: 48 },
    { id: 'na-central', label: 'NODE NA-CORE', x: '20%', y: '40%', status: 'defended', whiteHat: 74, blackHat: 26 },
    // Central America & Caribbean
    { id: 'ca', label: 'NODE CA-3', x: '22%', y: '50%', status: 'breached', whiteHat: 31, blackHat: 69 },
    // South America
    { id: 'sa-north', label: 'NODE SA-NORTE', x: '30%', y: '58%', status: 'contested', whiteHat: 45, blackHat: 55 },
    { id: 'sa-south', label: 'NODE SA-SUR', x: '28%', y: '72%', status: 'defended', whiteHat: 61, blackHat: 39 },
    // Europe
    { id: 'eu-west', label: 'NODE EU-WEST', x: '47%', y: '28%', status: 'defended', whiteHat: 71, blackHat: 29 },
    { id: 'eu-east', label: 'NODE EU-EAST', x: '55%', y: '26%', status: 'contested', whiteHat: 50, blackHat: 50 },
    { id: 'eu-north', label: 'NODE EU-NORD', x: '50%', y: '20%', status: 'defended', whiteHat: 82, blackHat: 18 },
    // Africa
    { id: 'af-north', label: 'NODE AF-NORTH', x: '49%', y: '44%', status: 'breached', whiteHat: 29, blackHat: 71 },
    { id: 'af-south', label: 'NODE AF-SOUTH', x: '53%', y: '62%', status: 'contested', whiteHat: 47, blackHat: 53 },
    // Middle East
    { id: 'me', label: 'NODE ME-PRIME', x: '58%', y: '40%', status: 'breached', whiteHat: 22, blackHat: 78 },
    // Asia
    { id: 'asia-central', label: 'NODE AS-CENTRAL', x: '65%', y: '30%', status: 'contested', whiteHat: 44, blackHat: 56 },
    { id: 'asia-east', label: 'NODE AS-EAST', x: '78%', y: '35%', status: 'breached', whiteHat: 33, blackHat: 67 },
    { id: 'asia-south', label: 'NODE AS-SOUTH', x: '70%', y: '48%', status: 'defended', whiteHat: 59, blackHat: 41 },
    // Oceania
    { id: 'au', label: 'NODE AU-PRIME', x: '82%', y: '68%', status: 'breached', whiteHat: 28, blackHat: 72 },
  ];

  const statusColors = {
    defended: { ring: 'border-cyan-400', dot: 'bg-cyan-400', shadow: 'shadow-[0_0_15px_rgba(0,224,255,0.8)]', text: 'text-cyan-400', label: 'DEFENDED' },
    contested: { ring: 'border-yellow-400', dot: 'bg-yellow-400', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.8)]', text: 'text-yellow-400', label: 'CONTESTED' },
    breached: { ring: 'border-red-500', dot: 'bg-red-500', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.8)]', text: 'text-red-500', label: 'BREACHED' },
  };

  // Auto-cycle through events for animation feel
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents = [
        { team: 'BLACK HAT', msgs: ['Phishing payload delivered to Sector 4', 'Zero-day exploit activated on Node 7F', 'Ransomware deployed on Grid B-11'], type: 'attack' },
        { team: 'WHITE HAT', msgs: ['Quarantine protocol initiated on Sector 4', 'Honeypot triggered — attacker IP logged', 'Incident response team deployed to Grid B-11'], type: 'defend' },
      ];
      const pick = newEvents[Math.floor(Math.random() * 2)];
      const msg = pick.msgs[Math.floor(Math.random() * pick.msgs.length)];
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setEvents(prev => [...prev.slice(-8), { id: Date.now(), time, team: pick.team, msg, type: pick.type }]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <Users /> FACTION WARS & GLOBAL OPERATIONS
          </h1>
          <p className="text-gray-400 font-body">Real-time tactical monitoring of global sector control and faction engagements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/30 font-code text-[10px] text-cyan-400">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
            LIVE FEED ACTIVE
          </div>
        </div>
      </header>

      {/* ═══════════ WORLD MAP — Hero Section ═══════════ */}
      <section className="relative w-full rounded-sm overflow-hidden border border-cyan-500/20 group" style={{ aspectRatio: '16/9' }}>
        
        {/* Video background (animated world map) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/world-map-clean.png"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/world-map-clean.mp4" type="video/mp4" />
        </video>

        {/* Scan-line overlay for tactical feel */}
        <div className="absolute inset-0 pointer-events-none z-10"
             style={{
               background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,224,255,0.015) 2px, rgba(0,224,255,0.015) 4px)',
             }}
        ></div>

        {/* Top-left HUD Badge */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-black/70 backdrop-blur-md border border-cyan-500/30 px-4 py-2 font-code text-xs text-cyan-400 flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <Globe size={14} className="animate-pulse" />
            GLOBAL THREAT MAP
          </div>
          <div className="bg-black/60 backdrop-blur-md border border-cyan-500/20 px-3 py-1.5 font-code text-[9px] text-gray-400 flex items-center gap-2">
            <Radio size={10} className="text-secondary-container" />
            SATELLITES: 24/7 &nbsp;|&nbsp; NODES: 98.7%
          </div>
        </div>

        {/* Top-right Legend */}
        <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md border border-cyan-500/20 px-4 py-3 font-code text-[10px] space-y-1.5 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="text-gray-500 tracking-widest mb-2 border-b border-cyan-500/10 pb-1">SECTOR STATUS</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,224,255,0.8)]"></div><span className="text-cyan-400">DEFENDED</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]"></div><span className="text-yellow-400">CONTESTED</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"></div><span className="text-red-500">BREACHED</span></div>
        </div>

        {/* Interactive Hotspot markers */}
        {hotspots.map(spot => {
          const s = statusColors[spot.status];
          return (
            <button
              key={spot.id}
              className={`absolute z-20 group/spot transition-all duration-300`}
              style={{ left: spot.x, top: spot.y, transform: 'translate(-50%, -50%)' }}
              onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
            >
              {/* Pulsing rings */}
              <div className={`absolute inset-0 w-8 h-8 -m-1.5 rounded-full border ${s.ring} opacity-30 animate-ping`}></div>
              <div className={`w-5 h-5 rounded-full border-2 ${s.ring} ${s.shadow} flex items-center justify-center bg-black/60 backdrop-blur-sm hover:scale-150 transition-transform duration-300`}>
                <div className={`w-2 h-2 rounded-full ${s.dot}`}></div>
              </div>

              {/* Tooltip on click */}
              {activeHotspot === spot.id && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-cyan-500/40 p-3 w-56 z-50 shadow-[0_0_30px_rgba(0,0,0,1)]"
                     style={{ animation: 'slideDown 0.2s ease-out' }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-code text-white text-[11px] font-bold">{spot.label}</span>
                    <span className={`font-code text-[9px] px-1.5 py-0.5 ${s.text} bg-black border ${s.ring} border-opacity-30`}>{s.label}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-[9px] font-code mb-0.5">
                        <span className="text-cyan-400 flex items-center gap-1"><Shield size={8}/> WHITE HAT</span>
                        <span className="text-cyan-400">{spot.whiteHat}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-variant"><div className="h-full bg-cyan-400" style={{ width: `${spot.whiteHat}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] font-code mb-0.5">
                        <span className="text-red-400 flex items-center gap-1"><Crosshair size={8}/> BLACK HAT</span>
                        <span className="text-red-400">{spot.blackHat}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-variant"><div className="h-full bg-red-500" style={{ width: `${spot.blackHat}%` }}></div></div>
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent z-10 pointer-events-none"></div>

        {/* Bottom bar with global stats */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-md border-t border-cyan-500/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-code text-[10px]">
              <Shield size={12} className="text-cyan-400" />
              <span className="text-gray-400">DEFENDERS:</span>
              <span className="text-cyan-400 font-bold">1,240</span>
            </div>
            <div className="flex items-center gap-2 font-code text-[10px]">
              <Crosshair size={12} className="text-red-400" />
              <span className="text-gray-400">ATTACKERS:</span>
              <span className="text-red-400 font-bold">1,402</span>
            </div>
            <div className="flex items-center gap-2 font-code text-[10px]">
              <Zap size={12} className="text-yellow-400" />
              <span className="text-gray-400">ACTIVE ENGAGEMENTS:</span>
              <span className="text-yellow-400 font-bold">37</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-code text-[9px] text-gray-500">
            <Eye size={10} />
            CLICK SECTORS FOR DETAILS
          </div>
        </div>
      </section>

      {/* ═══════════ Bottom Grid: Influence + Feed ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

        {/* Global Influence Stats */}
        <div className="lg:col-span-5 glass-panel border border-cyan-500/20 p-6 flex flex-col gap-5 relative overflow-hidden transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,224,255,0.08)]">
           <h3 className="font-code text-cyan-400 text-sm tracking-widest border-b border-cyan-500/20 pb-2 flex items-center gap-2">
             <Globe size={14} /> GLOBAL INFLUENCE BALANCE
           </h3>
           
           {/* Overall control bars */}
           <div className="flex flex-col gap-4">
              <div className="group/bar">
                <div className="flex justify-between text-xs font-code mb-1.5">
                  <span className="text-cyan-400 flex items-center gap-2 group-hover/bar:text-cyan-300 transition-colors"><Shield size={14}/> WHITE HAT ALLIANCE</span>
                  <span className="text-cyan-400 font-bold">45%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-variant relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 w-[45%] shadow-[0_0_10px_#00e0ff] group-hover/bar:shadow-[0_0_20px_#00e0ff] transition-all duration-500"></div>
                </div>
              </div>

              <div className="group/bar">
                <div className="flex justify-between text-xs font-code mb-1.5">
                  <span className="text-error flex items-center gap-2 group-hover/bar:text-red-400 transition-colors"><Crosshair size={14}/> BLACK HAT SYNDICATE</span>
                  <span className="text-error font-bold">55%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-variant relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-700 to-red-500 w-[55%] shadow-[0_0_10px_#ffb4ab] group-hover/bar:shadow-[0_0_20px_#ffb4ab] transition-all duration-500"></div>
                </div>
              </div>
           </div>

           {/* Faction Team Video Previews */}
           <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="relative border border-cyan-500/20 overflow-hidden group/vid cursor-pointer hover:border-cyan-400/60 transition-all duration-300">
                <video autoPlay loop muted playsInline className="w-full h-24 object-cover opacity-60 group-hover/vid:opacity-100 transition-opacity duration-500">
                  <source src="/WhiteTeam.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <span className="font-code text-[10px] text-cyan-400 flex items-center gap-1"><Shield size={10}/> WHITE HAT OPS</span>
                </div>
              </div>
              <div className="relative border border-red-500/20 overflow-hidden group/vid cursor-pointer hover:border-red-400/60 transition-all duration-300">
                <video autoPlay loop muted playsInline className="w-full h-24 object-cover opacity-60 group-hover/vid:opacity-100 transition-opacity duration-500">
                  <source src="/RedTeam.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <span className="font-code text-[10px] text-red-400 flex items-center gap-1"><Crosshair size={10}/> BLACK HAT OPS</span>
                </div>
              </div>
           </div>

           {/* Stats cards */}
           <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="border border-cyan-500/20 bg-cyan-400/5 p-3 text-center hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 group/stat">
                 <div className="text-2xl font-code text-cyan-400 group-hover/stat:drop-shadow-[0_0_10px_rgba(0,224,255,0.8)] transition-all">1,240</div>
                 <div className="text-[9px] text-gray-400 font-code mt-1 tracking-widest">ACTIVE DEFENDERS</div>
              </div>
              <div className="border border-error/20 bg-error/5 p-3 text-center hover:bg-error/10 hover:border-error/40 transition-all duration-300 group/stat">
                 <div className="text-2xl font-code text-error group-hover/stat:drop-shadow-[0_0_10px_rgba(255,180,171,0.8)] transition-all">1,402</div>
                 <div className="text-[9px] text-gray-400 font-code mt-1 tracking-widest">ACTIVE ATTACKERS</div>
              </div>
           </div>
        </div>

        {/* Live Event Feed */}
        <div className="lg:col-span-7 glass-panel border border-cyan-500/20 flex flex-col overflow-hidden transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,224,255,0.08)]">
           <header className="bg-[#10141a]/80 border-b border-cyan-500/20 p-4 font-code text-sm text-cyan-400 flex items-center justify-between">
             <div className="flex items-center gap-2"><Activity size={16}/> LIVE OPERATIONS FEED</div>
             <div className="flex items-center gap-3">
               <span className="text-[9px] text-gray-500 tracking-widest">AUTO-REFRESH: 5s</span>
               <div className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></div>
             </div>
           </header>
           
           <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
              {events.map((ev, idx) => (
                <div 
                  key={ev.id} 
                  className={`p-3 border-l-2 flex flex-col gap-1 transition-all duration-500 hover:translate-x-1 ${
                    ev.type === 'attack' 
                      ? 'border-error bg-error/5 hover:bg-error/10' 
                      : 'border-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/10'
                  }`}
                  style={{ 
                    animation: idx === events.length - 1 ? 'slideDown 0.3s ease-out' : 'none',
                  }}
                >
                   <div className="flex justify-between items-center text-[10px] font-code">
                     <span className={`flex items-center gap-1.5 ${ev.type === 'attack' ? 'text-error' : 'text-cyan-400'}`}>
                       {ev.type === 'attack' ? <AlertTriangle size={10}/> : <Shield size={10}/>}
                       {ev.team}
                     </span>
                     <span className="text-gray-500">{ev.time}</span>
                   </div>
                   <div className="text-sm text-gray-300 font-body">{ev.msg}</div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
