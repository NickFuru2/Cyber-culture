import React, { useState } from 'react';
import { Cpu, Wifi, Shield, Server, Box } from 'lucide-react';

export default function Inventory() {
  const [equipped, setEquipped] = useState({
    cpu: { name: 'Quantum Core v2', rarity: 'epic', buff: '+15% Terminal Speed' },
    neural: { name: 'Synapse Accelerator', rarity: 'legendary', buff: '+25% XP Gain' },
    firewall: { name: 'BlackICE Matrix', rarity: 'rare', buff: 'Auto-blocks low-level Intrusions' },
    adapter: null,
  });

  const slots = [
    { id: 'cpu', label: 'PROCESSOR (CPU)', icon: <Cpu /> },
    { id: 'neural', label: 'NEURAL LINK', icon: <Server /> },
    { id: 'firewall', label: 'FIREWALL DECK', icon: <Shield /> },
    { id: 'adapter', label: 'NETWORK ADAPTER', icon: <Wifi /> },
  ];

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <Box /> HARDWARE INVENTORY
          </h1>
          <p className="text-gray-400 font-body">Equip gear to optimize your hacking performance.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Equipped Loadout */}
        <div className="lg:col-span-5 glass-panel border border-cyan-500/20 p-6 flex flex-col gap-4">
           <h3 className="font-code text-cyan-400 text-sm tracking-widest border-b border-cyan-500/20 pb-2">CYBERNETIC LOADOUT</h3>
           <div className="grid grid-cols-1 gap-4 mt-2">
              {slots.map(s => {
                 const item = equipped[s.id];
                 return (
                   <div key={s.id} className={`border p-4 flex gap-4 items-center transition-all cursor-pointer ${item ? 'border-cyan-500/50 bg-[#10141a]' : 'border-dashed border-gray-700 hover:border-gray-500'}`}>
                      <div className={`w-12 h-12 flex items-center justify-center border ${item ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-gray-700 text-gray-700'}`}>
                         {s.icon}
                      </div>
                      <div className="flex-1">
                         <div className="text-[10px] font-code text-gray-500">{s.label}</div>
                         {item ? (
                           <>
                             <div className="font-code text-white text-sm">{item.name}</div>
                             <div className="text-[10px] text-secondary-container mt-1">{item.buff}</div>
                           </>
                         ) : (
                           <div className="text-sm font-body text-gray-600 italic mt-1">Empty Slot</div>
                         )}
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>

        {/* Stash / Available Items */}
        <div className="lg:col-span-7 glass-panel border border-cyan-500/20 p-6 flex flex-col">
           <h3 className="font-code text-cyan-400 text-sm tracking-widest border-b border-cyan-500/20 pb-2 mb-4">AVAILABLE HARDWARE STASH</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="border border-surface-variant p-4 bg-black/50 hover:border-cyan-400 transition-all cursor-pointer">
                 <h4 className="font-code text-white">Ghost Proxy V1</h4>
                 <div className="text-[10px] text-gray-500 font-code mt-1">NETWORK ADAPTER</div>
                 <div className="mt-4 text-xs text-secondary-container">+5% Stealth</div>
              </div>
              <div className="border border-error/50 p-4 bg-error/5 hover:border-error transition-all cursor-pointer">
                 <h4 className="font-code text-error">Overclocked CPU</h4>
                 <div className="text-[10px] text-gray-500 font-code mt-1">PROCESSOR (CPU)</div>
                 <div className="mt-4 text-xs text-error">-10% Trace Speed, +20% Hack Speed</div>
              </div>
              <div className="border border-purple-500/50 p-4 bg-purple-500/5 hover:border-purple-500 transition-all cursor-pointer">
                 <h4 className="font-code text-purple-400">Void Protocol</h4>
                 <div className="text-[10px] text-gray-500 font-code mt-1">FIREWALL DECK</div>
                 <div className="mt-4 text-xs text-purple-400">10% chance to reflect Intrusion</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
