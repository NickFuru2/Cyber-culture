import React, { useState } from 'react';
import { Users, MessageSquare, Database, Trophy } from 'lucide-react';

export default function Syndicate() {
  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <Users /> SYNDICATE HQ
          </h1>
          <p className="text-gray-400 font-body">Coordinate with your guild and manage collective resources.</p>
        </div>
        <div className="text-right">
           <div className="font-code text-xs text-gray-500">SYNDICATE TAG</div>
           <div className="font-code text-xl text-white">[NINJA] Neon Shadows</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[500px]">
        
        {/* Members List */}
        <div className="glass-panel border border-cyan-500/20 p-4 flex flex-col">
           <h3 className="font-code text-cyan-400 text-xs tracking-widest border-b border-cyan-500/20 pb-2 mb-4 flex justify-between">
             <span>OPERATIVES (12/50)</span>
             <span className="text-secondary-container">RANK #4</span>
           </h3>
           <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {['Neo (Leader)', 'Trinity', 'Morpheus', 'Switch', 'Apoc', 'Cypher', 'Mouse'].map((name, i) => (
                 <div key={i} className="p-2 border border-surface-variant flex justify-between items-center bg-[#10141a]">
                    <span className={`font-code text-sm ${i===0 ? 'text-cyan-400' : 'text-white'}`}>{name}</span>
                    <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></div>
                 </div>
              ))}
           </div>
        </div>

        {/* Guild Chat */}
        <div className="glass-panel border border-cyan-500/20 flex flex-col h-full lg:col-span-2">
           <header className="bg-cyan-900/20 border-b border-cyan-500/20 p-3 font-code text-sm text-cyan-400 flex items-center gap-2">
             <MessageSquare size={16}/> ENCRYPTED CHANNEL
           </header>
           <div className="flex-1 p-4 overflow-y-auto space-y-4 font-body custom-scrollbar">
              <div className="flex flex-col">
                <span className="text-[10px] font-code text-gray-500">Trinity - 10:41 AM</span>
                <span className="text-sm text-white">We need more firepower for the World Boss at 18:00.</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-code text-gray-500">Morpheus - 10:43 AM</span>
                <span className="text-sm text-white">I'll bring the Zero-Days. Neo, focus on the firewall.</span>
              </div>
           </div>
           <div className="p-3 border-t border-cyan-500/20 flex gap-2">
              <input type="text" className="flex-1 bg-black border border-surface-variant p-2 text-white font-code outline-none focus:border-cyan-400" placeholder="Broadcast message..." />
              <button className="bg-cyan-400 text-black px-4 font-code font-bold hover:bg-white transition-all">SEND</button>
           </div>
        </div>

      </div>
    </div>
  );
}
