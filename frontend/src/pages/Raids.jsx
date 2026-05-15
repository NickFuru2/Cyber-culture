import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { Target, Skull, AlertTriangle, Users } from 'lucide-react';

export default function Raids() {
  const globeEl = useRef(null);
  const [raidPopupOpen, setRaidPopupOpen] = useState(false);

  useEffect(() => {
    if (globeEl.current) {
      const world = Globe()(globeEl.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundColor('rgba(0,0,0,0)')
        .pointOfView({ altitude: 1.5 });

      const arcsData = [...Array(12).keys()].map(() => ({
          startLat: (Math.random() - 0.5) * 180,
          startLng: (Math.random() - 0.5) * 360,
          endLat: (Math.random() - 0.5) * 180,
          endLng: (Math.random() - 0.5) * 360,
          color: ['#00e0ff', '#d946ef', '#ff0055', '#7c3aed'][Math.floor(Math.random() * 4)]
      }));

      world.arcsData(arcsData)
          .arcColor('color')
          .arcDashLength(0.4)
          .arcDashGap(4)
          .arcDashInitialGap(() => Math.random() * 5)
          .arcDashAnimateTime(4000); // Much slower and calmer data streams
          
      // Add territory markers and the raid boss
      world.htmlElementsData([
        { lat: 34.0522, lng: -118.2437, name: 'ZEUS MAINFRAME', type: 'boss', color: 'error', bg: 'bg-error/20', border: 'border-error', text: 'text-error' },
        { lat: 35.6762, lng: 139.6503, name: 'TOKYO RELAY', type: 'node', faction: 'WHITE HATS', color: 'cyan-400', bg: 'bg-cyan-900/40', border: 'border-cyan-500', text: 'text-cyan-400' },
        { lat: 51.5074, lng: -0.1278, name: 'LONDON SERVERS', type: 'node', faction: 'BLACK HATS', color: 'fuchsia-500', bg: 'bg-fuchsia-900/40', border: 'border-fuchsia-500', text: 'text-fuchsia-400' }
      ])
      .htmlElement(d => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer pointer-events-auto';
        
        if (d.type === 'boss') {
           el.onclick = () => window.dispatchEvent(new CustomEvent('raid_click'));
           el.innerHTML = `
             <div class="flex items-center justify-center animate-bounce translate-x-[-50%] translate-y-[-50%] hover:scale-125 transition-transform duration-300">
               <div class="w-10 h-10 rounded-full ${d.bg} flex items-center justify-center border-2 ${d.border} shadow-[0_0_30px_rgba(255,0,0,1)] relative cursor-pointer">
                  <div class="w-full h-full absolute rounded-full border ${d.border} animate-ping"></div>
                  <span class="${d.text} font-bold drop-shadow-[0_0_10px_rgba(255,0,0,1)] text-lg">⚠</span>
               </div>
               <div class="ml-3 font-code text-white font-bold drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] whitespace-nowrap bg-error/20 backdrop-blur-md px-3 py-1 rounded border ${d.border}/50 tracking-widest cursor-pointer">${d.name}</div>
             </div>
           `;
        } else {
           // Territory Nodes
           el.innerHTML = `
             <div class="flex items-center justify-center translate-x-[-50%] translate-y-[-50%] hover:scale-110 transition-transform duration-300">
               <div class="w-6 h-6 rounded-full ${d.bg} flex items-center justify-center border ${d.border} shadow-[0_0_15px_currentColor] relative cursor-pointer text-${d.color}">
                  <div class="w-2 h-2 rounded-full bg-${d.color}"></div>
               </div>
               <div class="ml-2 font-code ${d.text} text-[10px] flex flex-col drop-shadow-[0_0_5px_currentColor] whitespace-nowrap bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-gray-800">
                  <span class="font-bold tracking-wider">${d.name}</span>
                  <span class="text-[8px] opacity-70">${d.faction} CTRL</span>
               </div>
             </div>
           `;
        }
        return el;
      });

      world.controls().autoRotate = true;
      world.controls().autoRotateSpeed = 1.0;
      world.controls().enableZoom = true;
    }
    
    const handleRaidClick = () => {
      setRaidPopupOpen(true);
    };
    
    window.addEventListener('raid_click', handleRaidClick);
    return () => window.removeEventListener('raid_click', handleRaidClick);
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center justify-center bg-black">
      {/* Globe Background */}
      <div ref={globeEl} className="absolute inset-0 z-0 opacity-100 mix-blend-screen brightness-125"></div>
      
      <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,224,255,0.1)]"></div>

      {/* Sleek Top Banner */}
      <div className="absolute top-0 w-full bg-gradient-to-r from-transparent via-error/20 to-transparent p-2 text-center z-10 backdrop-blur-sm border-b border-error/20">
         <h1 className="text-xl md:text-2xl font-h1 text-error font-bold drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] tracking-[0.3em] flex items-center justify-center gap-4">
           <AlertTriangle size={24} className="animate-pulse" /> GLOBAL THREAT MATRIX <AlertTriangle size={24} className="animate-pulse" />
         </h1>
      </div>

      {/* Raid Modal (Appears when marker is clicked) */}
      {raidPopupOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="w-full max-w-md glass-panel border border-error/80 p-8 flex flex-col gap-6 bg-black/80 shadow-[0_0_80px_rgba(255,0,0,0.6)] rounded-lg transform scale-100 transition-transform duration-300">
             <header className="border-b border-error/50 pb-3 flex justify-between items-center">
                <h2 className="text-xl font-h1 text-error flex items-center gap-2">
                  <Target size={24} className="animate-spin-slow" /> RAID DETECTED
                </h2>
                <button onClick={() => setRaidPopupOpen(false)} className="text-gray-400 hover:text-white border border-gray-600 hover:border-white w-8 h-8 flex items-center justify-center rounded-full transition-colors">X</button>
             </header>
             
             <div>
                <h3 className="text-white font-code text-3xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] font-bold text-center mt-2">ZEUS MAINFRAME</h3>
                <p className="text-sm font-body text-gray-300 leading-relaxed text-center mt-2 bg-error/10 p-3 rounded border border-error/20">
                  Sector 4 AI defenses breached. Global casualty rate approaching critical mass. Coordinated DDoS required.
                </p>
             </div>
             
             <div className="mt-4">
                <div className="flex justify-between text-xs font-code text-white mb-2 font-bold tracking-widest">
                   <span className="flex items-center gap-2"><Skull size={14}/> INTEGRITY</span>
                   <span className="text-error animate-pulse text-lg">12.4M / 50.0M</span>
                </div>
                <div className="w-full h-5 bg-black border border-error/50 p-[2px] relative overflow-hidden rounded-full">
                   <div className="h-full bg-error w-[25%] shadow-[0_0_15px_rgba(255,0,0,1)] relative z-10 rounded-full"></div>
                </div>
             </div>
             
             <div className="flex justify-between items-center mt-4 border-t border-error/30 pt-6 gap-4">
                <div className="text-xs font-code text-error/80 flex flex-col">
                   <span>ACTIVE HACKERS</span>
                   <span className="text-white text-2xl font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">4,012</span>
                </div>
                <button className="bg-error text-black font-code px-8 py-3 text-lg font-black hover:bg-white hover:text-error transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] flex items-center gap-2 rounded uppercase tracking-wider group hover:-translate-y-1">
                   <Skull size={20} className="group-hover:animate-bounce"/> ENGAGE
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Live Action Feed (Absolute Right) */}
      <div className="absolute right-8 top-20 bottom-8 z-10 w-64 glass-panel border border-cyan-500/30 bg-black/40 backdrop-blur-md rounded-lg flex flex-col overflow-hidden hidden lg:flex shadow-[0_0_30px_rgba(0,224,255,0.1)]">
         <div className="p-3 border-b border-cyan-500/30 bg-cyan-900/20 text-cyan-400 font-code text-xs font-bold tracking-widest flex items-center justify-between">
            <span>LIVE FEED</span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
         </div>
         <div className="flex-1 p-3 font-code text-[10px] space-y-3 overflow-hidden opacity-80 flex flex-col justify-end">
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:22]</span> Anon_77 dealt <span className="text-yellow-400">4,500 DMG</span></div>
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:24]</span> <span className="text-fuchsia-400">CyberPunk</span> deployed payload.</div>
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:25]</span> Zeus Mainframe retaliated. <span className="text-error">3 operatives disconnected.</span></div>
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:28]</span> Ghost_Protocol invested 500 ¤ to defenses.</div>
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:30]</span> Error: Connection refused by target.</div>
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:33]</span> Node 12 Alpha compromised by Black Hats!</div>
            <div className="text-gray-400"><span className="text-cyan-400">[09:01:35]</span> System overloads detected in Sector 4.</div>
         </div>
      </div>
    </div>
  );
}
