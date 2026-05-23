import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Coins, Gem, Plus, Terminal, Bell, Settings, Shield, ChevronDown, LogOut, Zap, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

const TopNav = ({ toggleNav, openTerminal, openSettings, openNotifications, openTopup }) => {
  const agentInfo = useStore(state => state.agentInfo);
  const streamerMode = useStore(state => state.streamerMode);
  const skillPoints = useStore(state => state.skillPoints);
  const logout = useStore(state => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const displayUsername = streamerMode ? 'ANON_USER' : agentInfo.username;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const xpPercent = agentInfo.nextLevelXp > 0 ? Math.round((agentInfo.xp / agentInfo.nextLevelXp) * 100) : 0;

  return (
    <header className="fixed top-0 w-full z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full gap-4">
        <div className="flex items-center gap-4">
          <button onClick={toggleNav} className="text-cyan-400 hover:text-cyan-300 md:hidden hover:scale-110 active:scale-95 transition-all"><Menu size={24}/></button>
          
          {/* Profile Button with Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 cursor-pointer group bg-cyan-900/30 px-3 md:px-4 py-2 rounded-full border border-cyan-500/30 hover:bg-cyan-900/60 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(0,224,255,0.4)] active:scale-95 transition-all duration-300"
            >
               <div className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-black overflow-hidden flex items-center justify-center shadow-[0_0_10px_rgba(0,224,255,0.8)] text-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,224,255,1)] group-hover:scale-110 transition-all duration-300">
                 <User size={18} />
               </div>
               <div className="text-left hidden sm:block">
                  <div className="font-code text-cyan-400 text-xs md:text-sm font-bold drop-shadow-[0_0_5px_rgba(0,224,255,0.8)] group-hover:drop-shadow-[0_0_10px_rgba(0,224,255,1)] transition-all">{displayUsername}</div>
                  <div className="font-code text-[10px] text-gray-400 group-hover:text-gray-300">{agentInfo.alignment}</div>
               </div>
               <ChevronDown size={14} className={`text-gray-400 hidden sm:block transition-transform duration-300 ${profileOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#0c1017]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,224,255,0.1)] z-[9999] overflow-hidden animate-[slideDown_0.2s_ease-out]"
                   style={{ animation: 'slideDown 0.2s ease-out' }}
              >
                {/* Agent Status Header */}
                <div className="p-4 bg-gradient-to-r from-cyan-900/30 via-cyan-900/10 to-transparent border-b border-cyan-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-[spin_10s_linear_infinite]"></div>
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0MtDy7kPspFOE2UXbr0pSmJxs4IYSREYDMySwB2BhC8U0AFSj_sAbTzY0g4LISjHUhkaf8rHyMLtQcxTNC0PABv98KdrK1JqBgx2skCa5Cy7SNwKwSuT5kXHGwd1q5IK1prk1tmCoeD-FSBpaAwHdAQXKHRQQkJYNfguxpetCqsfI7vrF0n14u1KvAnIajrAIgSUucJ1V-cM_DToRfY3quvkLCskkCPdH4qIEUFrZdMPjXA2HTs5A2sfL0-JFK-c4bGdXIeED_2Ni" alt="Rank" className="w-full h-full rounded-full object-cover border-2 border-[#161B22] p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-code text-white text-sm font-bold truncate">{displayUsername}</h3>
                        <span className="font-code text-[9px] text-secondary-container px-1.5 py-0.5 bg-secondary-container/10 border border-secondary-container/30 flex-shrink-0">ONLINE</span>
                      </div>
                      <p className="font-code text-cyan-400 text-[11px] mt-0.5">LVL {agentInfo.level}: {agentInfo.title}</p>
                      <p className="font-code text-gray-500 text-[10px]">{agentInfo.alignment}</p>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="mt-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-code text-[10px] text-gray-400 flex items-center gap-1">
                        <Zap size={10} className="text-cyan-400" /> EXPERIENCE
                      </span>
                      <span className="font-code text-[10px] text-cyan-400">{agentInfo.xp} / {agentInfo.nextLevelXp} XP</span>
                    </div>
                    <div className="flex gap-0.5 h-1.5">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`flex-1 transition-all duration-300 ${i < Math.round(xpPercent / 10) ? 'bg-secondary-container shadow-[0_0_6px_rgba(195,244,0,0.5)]' : 'bg-surface-variant/50'}`}></div>
                      ))}
                    </div>
                    <div className="text-right mt-1">
                      <span className="font-code text-[9px] text-gray-500">Next: LVL {agentInfo.level + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-900/30 transition-all duration-200 group"
                  >
                    <User size={15} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-code text-xs text-gray-300 group-hover:text-white transition-colors">AGENT PROFILE</span>
                  </Link>
                  <Link
                    to="/inventory"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-900/30 transition-all duration-200 group"
                  >
                    <Shield size={15} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-code text-xs text-gray-300 group-hover:text-white transition-colors">INVENTORY</span>
                  </Link>
                  <button
                    onClick={() => { openSettings(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-900/30 transition-all duration-200 group"
                  >
                    <Settings size={15} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-code text-xs text-gray-300 group-hover:text-white transition-colors">SETTINGS</span>
                  </button>
                  <div className="border-t border-cyan-500/10 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-900/30 transition-all duration-200 group"
                  >
                    <LogOut size={15} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                    <span className="font-code text-xs text-gray-300 group-hover:text-red-400 transition-colors">LOGOUT</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="border-t border-cyan-500/10 px-4 py-3 bg-black/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse shadow-[0_0_5px_rgba(195,244,0,0.8)]"></div>
                      <span className="font-code text-[9px] text-gray-500">UPLINK ACTIVE</span>
                    </div>
                    <span className="font-code text-[9px] text-gray-600">v4.2.1</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Link to="/" className="text-lg md:text-xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(0,224,255,0.5)] hover:drop-shadow-[0_0_25px_rgba(0,224,255,1)] hover:scale-105 transition-all duration-300 font-h1 absolute left-1/2 -translate-x-1/2">
          CYBER_OPS://CORE
        </Link>

        <div className="flex items-center gap-4 text-cyan-400">
          {/* Balance Widgets */}
          <div className="hidden md:flex items-center gap-4">
             {/* Game Credits */}
             <div className="flex items-center gap-2 bg-black/50 border border-secondary-container/30 px-3 py-1.5 rounded-full hover:border-secondary-container/80 hover:bg-secondary-container/10 transition-all duration-300 cursor-default group" title="Game Credits (Free)">
                <Coins size={14} className="text-secondary-container group-hover:animate-bounce" />
                <span className="font-code text-sm font-bold text-secondary-container drop-shadow-[0_0_5px_rgba(195,244,0,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(195,244,0,1)] transition-all">{(agentInfo.gameCredits || 0).toLocaleString()}</span>
             </div>
             {/* Skill Points */}
             <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-500/40 px-3 py-1.5 rounded-full hover:border-amber-400 hover:bg-amber-900/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 cursor-default group" title="Skill Points">
                <Sparkles size={14} className="text-amber-400 group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300" />
                <span className="font-code text-sm font-bold text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,1)] transition-all">{skillPoints}</span>
                <span className="font-code text-[9px] text-amber-400/60 hidden lg:inline">SP</span>
             </div>
             {/* Premium Credits */}
             <div className="flex items-center gap-2 bg-fuchsia-900/20 border border-fuchsia-500/50 px-3 py-1.5 rounded-full hover:border-fuchsia-400 hover:bg-fuchsia-900/40 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all duration-300 group" title="Premium Credits (Donate)">
                <Gem size={14} className="text-fuchsia-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-code text-sm font-bold text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(217,70,239,1)] transition-all">{(agentInfo.premiumCredits || 0).toLocaleString()}</span>
                <button onClick={openTopup} className="ml-1 bg-fuchsia-600 hover:bg-fuchsia-400 text-white hover:text-black rounded-full p-1 shadow-[0_0_10px_rgba(217,70,239,0.5)] hover:shadow-[0_0_20px_rgba(217,70,239,1)] hover:rotate-90 active:scale-75 transition-all duration-300">
                  <Plus size={14} />
                </button>
             </div>
          </div>

          <button onClick={openTerminal} className="hover:text-cyan-300 hidden md:block hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(0,224,255,0.8)] active:scale-90 transition-all duration-200"><Terminal size={20}/></button>
          <button onClick={openNotifications} className="hover:text-cyan-300 relative hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(0,224,255,0.8)] active:scale-90 transition-all duration-200 group">
            <Bell size={20} className="group-hover:origin-top group-hover:animate-[bounce_0.5s_ease-in-out_infinite]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full animate-pulse shadow-[0_0_5px_rgba(255,0,0,0.8)]"></span>
          </button>
          <button onClick={openSettings} className="hover:text-cyan-300 hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(0,224,255,0.8)] hover:rotate-45 active:scale-90 transition-all duration-300"><Settings size={20}/></button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
