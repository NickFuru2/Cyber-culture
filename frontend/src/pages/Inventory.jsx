import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Shield, Server, Box, Zap, Lock, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

const RARITY_COLORS = {
  common: { text: 'text-gray-400', border: 'border-gray-600', bg: 'bg-gray-600/10', glow: '' },
  uncommon: { text: 'text-green-400', border: 'border-green-500', bg: 'bg-green-500/10', glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' },
  rare: { text: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_15px_rgba(0,224,255,0.4)]' },
  epic: { text: 'text-fuchsia-400', border: 'border-fuchsia-500', bg: 'bg-fuchsia-500/10', glow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]' },
  legendary: { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.6)]' },
};

const AVAILABLE_ITEMS = [
  { id: 'cpu1', name: 'Quantum Core v2', type: 'cpu', rarity: 'epic', buff: '+15% Terminal Speed', stats: { speed: 15 } },
  { id: 'cpu2', name: 'Overclocked CPU', type: 'cpu', rarity: 'rare', buff: '+20% Hack Speed, -10% Trace Speed', stats: { hack: 20, trace: -10 } },
  { id: 'cpu3', name: 'Basic Processor', type: 'cpu', rarity: 'common', buff: '+5% Processing', stats: { speed: 5 } },

  { id: 'neural1', name: 'Synapse Accelerator', type: 'neural', rarity: 'legendary', buff: '+25% XP Gain', stats: { xp: 25 } },
  { id: 'neural2', name: 'Neural Booster', type: 'neural', rarity: 'rare', buff: '+15% XP Gain', stats: { xp: 15 } },
  { id: 'neural3', name: 'Cortex Link', type: 'neural', rarity: 'uncommon', buff: '+10% Skill Point Gain', stats: { sp: 10 } },

  { id: 'firewall1', name: 'BlackICE Matrix', type: 'firewall', rarity: 'rare', buff: 'Auto-blocks low-level Intrusions', stats: { defense: 20 } },
  { id: 'firewall2', name: 'Void Protocol', type: 'firewall', rarity: 'epic', buff: '10% chance to reflect Intrusion', stats: { defense: 25, reflect: 10 } },
  { id: 'firewall3', name: 'Basic Firewall', type: 'firewall', rarity: 'common', buff: '+5% Defense', stats: { defense: 5 } },

  { id: 'adapter1', name: 'Ghost Proxy V1', type: 'adapter', rarity: 'uncommon', buff: '+5% Stealth', stats: { stealth: 5 } },
  { id: 'adapter2', name: 'Quantum Router', type: 'adapter', rarity: 'epic', buff: '+30% Network Speed', stats: { network: 30 } },
  { id: 'adapter3', name: 'Stealth Adapter Pro', type: 'adapter', rarity: 'rare', buff: '+15% Stealth, +10% Speed', stats: { stealth: 15, speed: 10 } },
];

export default function Inventory() {
  const agentInfo = useStore(state => state.agentInfo);
  const [equipped, setEquipped] = useState({
    cpu: null,
    neural: null,
    firewall: null,
    adapter: null,
  });
  const [inventory, setInventory] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    // Initialize with some starter items
    setInventory(AVAILABLE_ITEMS);
    // Equip some default items
    setEquipped({
      cpu: AVAILABLE_ITEMS.find(i => i.id === 'cpu1'),
      neural: AVAILABLE_ITEMS.find(i => i.id === 'neural1'),
      firewall: AVAILABLE_ITEMS.find(i => i.id === 'firewall1'),
      adapter: null,
    });
  }, []);

  const handleEquip = (item) => {
    setEquipped(prev => ({ ...prev, [item.type]: item }));
    setSelectedSlot(null);
  };

  const handleUnequip = (slotType) => {
    setEquipped(prev => ({ ...prev, [slotType]: null }));
  };

  const slots = [
    { id: 'cpu', label: 'PROCESSOR (CPU)', icon: <Cpu />, desc: 'Controls processing speed and terminal efficiency' },
    { id: 'neural', label: 'NEURAL LINK', icon: <Server />, desc: 'Enhances learning and XP acquisition' },
    { id: 'firewall', label: 'FIREWALL DECK', icon: <Shield />, desc: 'Protects against intrusions and attacks' },
    { id: 'adapter', label: 'NETWORK ADAPTER', icon: <Wifi />, desc: 'Improves network speed and stealth' },
  ];

  const availableForSlot = selectedSlot ? inventory.filter(i => i.type === selectedSlot) : [];

  const totalStats = Object.values(equipped).reduce((acc, item) => {
    if (!item) return acc;
    Object.entries(item.stats).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + value;
    });
    return acc;
  }, {});

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <Box /> HARDWARE INVENTORY
          </h1>
          <p className="text-gray-400 font-body">Equip gear to optimize your hacking performance.</p>
        </div>
        <div className="text-right">
          <div className="font-code text-xs text-gray-500">TOTAL ITEMS</div>
          <div className="font-code text-xl text-cyan-400">{inventory.length}</div>
        </div>
      </header>

      {/* Stats Overview */}
      {Object.keys(totalStats).length > 0 && (
        <div className="glass-panel border border-secondary-container/30 bg-secondary-container/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-secondary-container" />
            <h3 className="font-code text-sm text-secondary-container tracking-widest">ACTIVE BONUSES</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(totalStats).map(([key, value]) => (
              <div key={key} className="px-3 py-1.5 bg-black/50 border border-secondary-container/30 font-code text-xs">
                <span className="text-gray-400 uppercase">{key}: </span>
                <span className="text-secondary-container font-bold">{value > 0 ? '+' : ''}{value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Equipped Loadout */}
        <div className="lg:col-span-5 glass-panel border border-cyan-500/20 p-6 flex flex-col gap-4">
           <h3 className="font-code text-cyan-400 text-sm tracking-widest border-b border-cyan-500/20 pb-2">CYBERNETIC LOADOUT</h3>
           <div className="grid grid-cols-1 gap-4 mt-2">
              {slots.map(s => {
                 const item = equipped[s.id];
                 const rarityStyle = item ? RARITY_COLORS[item.rarity] : null;
                 return (
                   <div
                     key={s.id}
                     className={`border p-4 flex gap-4 items-center transition-all cursor-pointer ${
                       item
                         ? `${rarityStyle.border} bg-[#10141a] ${rarityStyle.glow} hover:scale-[1.02]`
                         : 'border-dashed border-gray-700 hover:border-cyan-500/50'
                     } ${selectedSlot === s.id ? 'ring-2 ring-cyan-400' : ''}`}
                     onClick={() => setSelectedSlot(selectedSlot === s.id ? null : s.id)}
                   >
                      <div className={`w-12 h-12 flex items-center justify-center border ${
                        item
                          ? `${rarityStyle.border} ${rarityStyle.text} ${rarityStyle.bg}`
                          : 'border-gray-700 text-gray-700'
                      }`}>
                         {s.icon}
                      </div>
                      <div className="flex-1">
                         <div className="text-[10px] font-code text-gray-500">{s.label}</div>
                         {item ? (
                           <>
                             <div className={`font-code text-sm ${rarityStyle.text} font-bold`}>{item.name}</div>
                             <div className="text-[10px] text-secondary-container mt-1">{item.buff}</div>
                           </>
                         ) : (
                           <>
                             <div className="text-sm font-body text-gray-600 italic mt-1">Empty Slot</div>
                             <div className="text-[9px] text-gray-700 mt-0.5">{s.desc}</div>
                           </>
                         )}
                      </div>
                      {item && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUnequip(s.id); }}
                          className="px-2 py-1 bg-red-900/20 border border-red-500/30 text-red-400 text-[10px] font-code hover:bg-red-900/40 transition-all"
                        >
                          UNEQUIP
                        </button>
                      )}
                   </div>
                 );
              })}
           </div>
        </div>

        {/* Available Items */}
        <div className="lg:col-span-7 glass-panel border border-cyan-500/20 p-6 flex flex-col">
           <h3 className="font-code text-cyan-400 text-sm tracking-widest border-b border-cyan-500/20 pb-2 mb-4">
             {selectedSlot ? `AVAILABLE ${slots.find(s => s.id === selectedSlot)?.label}` : 'HARDWARE STASH'}
           </h3>

           {selectedSlot && availableForSlot.length === 0 && (
             <div className="flex flex-col items-center justify-center py-12 text-center">
               <Lock size={48} className="text-gray-700 mb-4" />
               <div className="font-code text-gray-500 text-sm">NO ITEMS AVAILABLE FOR THIS SLOT</div>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedSlot ? availableForSlot : inventory).map(item => {
                const rarityStyle = RARITY_COLORS[item.rarity];
                const isEquipped = equipped[item.type]?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`border p-4 bg-black/50 transition-all cursor-pointer ${rarityStyle.border} ${rarityStyle.glow} hover:scale-[1.02] ${isEquipped ? 'opacity-50' : 'hover:bg-black/70'}`}
                    onClick={() => !isEquipped && handleEquip(item)}
                  >
                     <div className="flex items-start justify-between mb-2">
                       <h4 className={`font-code ${rarityStyle.text} font-bold`}>{item.name}</h4>
                       <div className="flex items-center gap-1">
                         {[...Array(Object.keys(RARITY_COLORS).indexOf(item.rarity) + 1)].map((_, i) => (
                           <Star key={i} size={10} className={rarityStyle.text} fill="currentColor" />
                         ))}
                       </div>
                     </div>
                     <div className="text-[10px] text-gray-500 font-code uppercase mb-3">{item.type}</div>
                     <div className="text-xs text-secondary-container">{item.buff}</div>
                     {isEquipped && (
                       <div className="mt-3 text-[10px] font-code text-cyan-400 flex items-center gap-1">
                         <Zap size={10} /> EQUIPPED
                       </div>
                     )}
                  </div>
                );
              })}
           </div>
        </div>

      </div>
    </div>
  );
}
