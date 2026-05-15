import React, { useState } from 'react';
import { User, Key, Cpu, Wifi, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Profile() {
  const agentInfo = useStore(state => state.agentInfo);
  const [glitchField, setGlitchField] = useState(null);

  const handleInput = (e) => {
    setGlitchField(e.target.name);
    setTimeout(() => setGlitchField(null), 150);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <header className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <User /> AGENT PROFILE_EDITOR
          </h1>
          <p className="text-gray-400 font-body">Modify system parameters and public identity.</p>
        </div>
      </header>

      <div className="glass-panel border border-cyan-500/20 p-8 flex flex-col gap-8 glow-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-8">
           <div className="relative w-32 h-32 flex-shrink-0 group cursor-pointer">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 group-hover:animate-[spin_2s_linear_infinite]"></div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-MpSN1T97z1DIchgihS2aICTZAqgMT273v9n1mvoMgDTbkrUFT8PPPZE56fMVHHc1BIP68Nr_VEuSeZ2BGPvppBgKA7uSx80KpmNAfjMgrMcXBiOdLj3MwSXUtFPl3zrR2qsCe4lSBJvctlZW4b-3SWBK4BAIIOkULBSV65kdyFVjU146z1eKOWmi7jqcZSeYliWiqhbYRHsDTsOxWTvTebn8nODo6-CovqZGiY7wdgE6_8rSJcMHqaMfNtMppX8Pcbl0mVT-TC9R" alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-[#161B22] p-1" />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-cyan-400 font-code text-xs transition-opacity">UPDATE</div>
           </div>
           <div className="flex-1">
              <h3 className="text-3xl font-bold font-h1 text-white">{agentInfo.username}</h3>
              <p className="text-cyan-400 font-code">CLASS: {agentInfo.title} | CLEARANCE: Lvl {agentInfo.level}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="flex flex-col gap-2">
             <label className="font-code text-xs text-gray-500 flex items-center gap-2"><Key size={14}/> CODENAME (ALIAS)</label>
             <input 
               type="text" 
               name="alias"
               defaultValue={agentInfo.username} 
               onInput={handleInput}
               className={`bg-surface-variant/30 border border-cyan-500/30 p-3 text-cyan-400 font-code focus:outline-none focus:border-cyan-400 transition-all ${glitchField === 'alias' ? 'text-white text-shadow-[0_0_10px_#00e0ff]' : ''}`}
             />
          </div>
          <div className="flex flex-col gap-2">
             <label className="font-code text-xs text-gray-500 flex items-center gap-2"><Wifi size={14}/> SECURE UPLINK EMAIL</label>
             <input 
               type="email" 
               name="email"
               defaultValue="agent042@cyber-ops.net" 
               onInput={handleInput}
               className={`bg-surface-variant/30 border border-cyan-500/30 p-3 text-cyan-400 font-code focus:outline-none focus:border-cyan-400 transition-all ${glitchField === 'email' ? 'text-white text-shadow-[0_0_10px_#00e0ff]' : ''}`}
             />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
             <label className="font-code text-xs text-gray-500 flex items-center gap-2"><Cpu size={14}/> HARDWARE SIGNATURE</label>
             <input 
               type="text" 
               name="hwid"
               defaultValue="0x8F9A2B... [SPOOFED]" 
               disabled
               className="bg-black/50 border border-gray-600 p-3 text-gray-500 font-code cursor-not-allowed"
             />
          </div>
        </div>
        
        <button className="mt-4 bg-cyan-400 text-slate-950 font-code tracking-widest py-3 hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(0,224,255,0.6)] flex justify-center items-center gap-2 transition-all w-full md:w-auto self-end px-8">
           COMMIT CHANGES
        </button>
      </div>
    </div>
  );
}
