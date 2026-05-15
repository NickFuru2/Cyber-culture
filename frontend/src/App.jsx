import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Shield, Crosshair, User, Settings, Bell, Database, Globe, Users, Menu, MonitorPlay, MessageSquare, LayoutDashboard, Box, Target, AlertTriangle, Plus, Coins, Gem, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from './store/useStore';

import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Missions from './pages/Missions';
import Academy from './pages/Academy';
import Profile from './pages/Profile';
import Armory from './pages/Armory';
import Factions from './pages/Factions';
import Inventory from './pages/Inventory';
import Syndicate from './pages/Syndicate';
import Raids from './pages/Raids';
import Textbooks from './pages/Textbooks';
import PvP from './pages/PvP';

import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import CommandPalette from './components/CommandPalette';
import Registration from './components/Registration';
import PageTransition from './components/PageTransition';


function App() {
  const [booted, setBooted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [checkoutState, setCheckoutState] = useState('idle');
  
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);
  const streamerMode = useStore(state => state.streamerMode);
  const toggleStreamerMode = useStore(state => state.toggleStreamerMode);
  const addPremiumCredits = useStore(state => state.addPremiumCredits);
  const agentInfo = useStore(state => state.agentInfo);

  // Terminal Chat State
  const [chatLog, setChatLog] = useState([{ sender: 'system', msg: 'HACKER COMMLINK SECURED. TYPE /HELP.' }]);
  const [chatInput, setChatInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => { chatRef.current?.scrollIntoView(); }, [chatLog]);

  const handleChat = (e) => {
    if (e.key === 'Enter' && chatInput.trim()) {
      const msg = chatInput.trim();
      setChatLog(prev => [...prev, { sender: 'you', msg }]);
      setChatInput('');
      
      setTimeout(() => {
        if (msg === '/help') setChatLog(prev => [...prev, { sender: 'system', msg: 'Try: /scan, /ping, /joke' }]);
        else if (msg === '/scan') setChatLog(prev => [...prev, { sender: 'system', msg: 'SCANNING... No threats found in sector.' }]);
        else if (msg === '/ping') setChatLog(prev => [...prev, { sender: 'system', msg: 'PONG 12ms' }]);
        else setChatLog(prev => [...prev, { sender: 'agent_x', msg: 'Copy that.' }]);
      }, 600);
    }
  };



  if (!booted) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center cursor-pointer" onClick={() => setBooted(true)}>
         <div className="text-primary font-code text-4xl animate-pulse font-bold drop-shadow-[0_0_15px_rgba(0,224,255,0.8)]">SYSTEM OFFLINE</div>
         <div className="text-gray-500 font-code mt-4 tracking-widest">[ CLICK TO INITIALIZE SECURE UPLINK ]</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Registration />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-body pt-16 flex flex-col transition-all duration-300 relative">
        <TopNav toggleNav={() => setNavOpen(!navOpen)} openTerminal={() => setTerminalOpen(true)} openSettings={() => setSettingsOpen(true)} openNotifications={() => setNotificationsOpen(true)} openTopup={() => setTopupOpen(true)} />
        <SideNav isOpen={navOpen} setIsOpen={setNavOpen} />
        <main className={`flex-1 w-full mx-auto transition-all duration-300 md:pl-20 overflow-x-hidden`}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/armory" element={<Armory />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/syndicate" element={<Syndicate />} />
              <Route path="/factions" element={<Factions />} />
              <Route path="/raids" element={<Raids />} />
              <Route path="/textbooks" element={<Textbooks />} />
              <Route path="/pvp" element={<PvP />} />
            </Routes>
          </PageTransition>
        </main>
        <CommandPalette />

        {/* Terminal Chat Modal */}
        {terminalOpen && (
          <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-96 h-96 bg-[#10141a]/95 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,224,255,0.2)] z-50 flex flex-col backdrop-blur-md">
             <div className="bg-cyan-900/30 p-2 border-b border-cyan-500/30 flex justify-between items-center font-code text-xs text-cyan-400">
                <span className="flex items-center gap-2"><MessageSquare size={14}/> COMMLINK</span>
                <button onClick={() => setTerminalOpen(false)} className="hover:text-error">X</button>
             </div>
             <div className="flex-1 p-3 overflow-y-auto font-code text-[10px] space-y-2 custom-scrollbar">
                {chatLog.map((log, i) => (
                  <div key={i} className={log.sender === 'system' ? 'text-secondary-container' : log.sender === 'you' ? 'text-white' : 'text-cyan-400'}>
                    <span className="opacity-50">[{log.sender}] </span>{log.msg}
                  </div>
                ))}
                <div ref={chatRef}/>
             </div>
             <div className="p-2 border-t border-cyan-500/30 flex bg-black">
                <span className="font-code text-cyan-400 text-xs mr-2">{'>'}</span>
                <input autoFocus value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={handleChat} className="bg-transparent flex-1 text-white text-xs font-code outline-none border-none" placeholder="Type command..." />
             </div>
          </div>
        )}

        {/* Notifications Drawer/Modal */}
        {notificationsOpen && (
          <div className="fixed top-16 right-0 w-80 max-w-[90vw] h-auto max-h-[80vh] bg-[#10141a]/95 border border-cyan-500/50 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-50 flex flex-col backdrop-blur-md rounded-bl-lg">
             <div className="bg-cyan-900/30 p-3 border-b border-cyan-500/30 flex justify-between items-center font-code text-sm text-cyan-400">
                <span className="flex items-center gap-2"><Bell size={16}/> SYSTEM ALERTS</span>
                <button onClick={() => setNotificationsOpen(false)} className="hover:text-white">X</button>
             </div>
             <div className="flex-1 p-4 overflow-y-auto font-code space-y-4 custom-scrollbar">
                <div className="border-l-2 border-error-container pl-3 py-1">
                  <div className="flex justify-between items-start mb-1 text-[10px] text-error-container"><span>SECURITY BREACH</span><span>JUST NOW</span></div>
                  <p className="text-xs text-gray-400 font-body">Multiple failed login attempts detected on Sector 7 Gateway.</p>
                </div>
                <div className="border-l-2 border-cyan-500 pl-3 py-1 bg-cyan-900/10">
                  <div className="flex justify-between items-start mb-1 text-[10px] text-cyan-400"><span>SYSTEM UPDATE</span><span>09:15 AM</span></div>
                  <p className="text-xs text-gray-400 font-body">Core systems upgraded to v4.2.1. Terminal performance improved by 14%.</p>
                </div>
                <div className="border-l-2 border-secondary-container pl-3 py-1 bg-secondary-container/10">
                  <div className="flex justify-between items-start mb-1 text-[10px] text-secondary-container"><span>MARKET ALERT</span><span>YESTERDAY</span></div>
                  <p className="text-xs text-gray-400 font-body">DDoS Botnet Tokens are up 14.2%. Sell now for maximum profit.</p>
                </div>
             </div>
          </div>
        )}

        {/* Settings Modal */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSettingsOpen(false)}>
             <div className="bg-[#161B22] border border-surface-variant w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-surface-variant flex justify-between items-center font-code text-white">
                   <span className="flex items-center gap-2"><Settings size={18}/> SYSTEM PREFERENCES</span>
                   <button onClick={() => setSettingsOpen(false)} className="text-gray-500 hover:text-white">X</button>
                </div>
                <div className="p-6 font-code text-sm space-y-6">
                   <div>
                     <div className="text-gray-400 text-xs mb-2 flex justify-between">
                       <span>INTERFACE LANGUAGE</span>
                       <span className="text-cyan-400">{language}</span>
                     </div>
                     <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-black border border-surface-variant p-2 text-white outline-none focus:border-cyan-400">
                       <option value="EN">ENGLISH [EN]</option>
                       <option value="RU">РУССКИЙ [RU]</option>
                       <option value="UZ">O'ZBEKCHA [UZ]</option>
                     </select>
                   </div>
                   <div>
                     <div className="text-gray-400 text-xs mb-2">UI THEME / HUE</div>
                     <div className="flex gap-2">
                       <button className="w-8 h-8 bg-cyan-400 border-2 border-white"></button>
                       <button className="w-8 h-8 bg-error border-2 border-transparent"></button>
                       <button className="w-8 h-8 bg-secondary-container border-2 border-transparent"></button>
                     </div>
                   </div>
                   <div className="flex items-center justify-between p-3 border border-surface-variant bg-black/50">
                     <div>
                       <div className="text-white text-xs">STREAMER MODE</div>
                       <div className="text-gray-500 text-[9px] mt-1 max-w-[200px]">Hides your IP and Agent Name to prevent DOXing during live broadcasts.</div>
                     </div>
                     <div 
                       onClick={toggleStreamerMode}
                       className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${streamerMode ? 'bg-cyan-500' : 'bg-gray-700'}`}
                     >
                       <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${streamerMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between p-3 border border-surface-variant bg-black/50">
                     <div className="text-gray-400 text-xs">TERMINAL SOUND FX</div>
                     <input type="checkbox" className="w-4 h-4" defaultChecked />
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Topup Modal */}
        {topupOpen && (
          <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setTopupOpen(false)}>
             <div className="bg-[#10051a] border-2 border-fuchsia-500 w-full max-w-4xl shadow-[0_0_100px_rgba(217,70,239,0.3)] flex flex-col rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-fuchsia-900 to-indigo-900 p-6 flex justify-between items-center font-code text-white">
                   <div className="flex items-center gap-3">
                     <Gem size={28} className="text-fuchsia-300 animate-pulse"/> 
                     <div>
                       <h2 className="text-2xl md:text-3xl font-black tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-white">PREMIUM ACCESS</h2>
                       <div className="text-[10px] md:text-xs text-fuchsia-200 tracking-widest uppercase">Acquire high-tier secure credits for black market trades</div>
                     </div>
                   </div>
                   <button onClick={() => setTopupOpen(false)} className="text-fuchsia-300 hover:text-white bg-black/20 p-2 rounded-full backdrop-blur-md transition-colors"><Plus size={20} className="rotate-45"/></button>
                </div>
                <div className="p-8 font-code space-y-8 relative">
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent pointer-events-none z-0"></div>
                   
                   <div className="text-center bg-black/60 border border-fuchsia-500/30 p-6 rounded-xl relative z-10 max-w-sm mx-auto shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                     <div className="text-fuchsia-400 text-xs tracking-widest mb-2 font-bold">CURRENT PREMIUM BALANCE</div>
                     <div className="text-4xl text-fuchsia-300 font-bold drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] flex justify-center items-center gap-3">
                       {(agentInfo.premiumCredits || 0).toLocaleString()} <Gem size={28} className="text-fuchsia-400" />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                     <button onClick={() => { setSelectedPackage({ amount: 1000, price: 9.99 }); setTopupOpen(false); setCheckoutOpen(true); }} className="p-6 border border-fuchsia-500/30 bg-fuchsia-900/10 hover:bg-fuchsia-900/40 hover:border-fuchsia-400 transition-all text-center flex flex-col items-center gap-4 group rounded-xl hover:-translate-y-2">
                        <Gem size={36} className="text-fuchsia-500 group-hover:text-fuchsia-300 transition-colors" />
                        <span className="text-3xl text-white font-bold group-hover:text-fuchsia-300 drop-shadow-[0_0_5px_rgba(0,0,0,1)]">1,000</span>
                        <span className="text-sm text-fuchsia-200 bg-black/50 px-5 py-2 rounded-full border border-fuchsia-900 group-hover:border-fuchsia-500 transition-all font-bold">$9.99</span>
                     </button>
                     <button onClick={() => { setSelectedPackage({ amount: 5000, price: 39.99 }); setTopupOpen(false); setCheckoutOpen(true); }} className="p-6 border border-fuchsia-500/50 bg-fuchsia-900/20 hover:bg-fuchsia-900/40 hover:border-fuchsia-300 transition-all text-center flex flex-col items-center gap-4 group rounded-xl relative hover:-translate-y-2 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
                        <div className="absolute -top-3 bg-fuchsia-600 text-white text-[10px] px-4 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(217,70,239,0.8)] tracking-widest">MOST POPULAR</div>
                        <Gem size={48} className="text-fuchsia-400 group-hover:text-fuchsia-200 transition-colors" />
                        <span className="text-4xl text-white font-bold group-hover:text-fuchsia-300 drop-shadow-[0_0_5px_rgba(0,0,0,1)]">5,000</span>
                        <span className="text-sm text-fuchsia-200 bg-black/50 px-5 py-2 rounded-full border border-fuchsia-900 group-hover:border-fuchsia-500 transition-all font-bold">$39.99</span>
                     </button>
                     <button onClick={() => { setSelectedPackage({ amount: 15000, price: 89.99 }); setTopupOpen(false); setCheckoutOpen(true); }} className="p-6 border-2 border-fuchsia-400 bg-gradient-to-b from-fuchsia-900/40 to-indigo-900/40 hover:from-fuchsia-800/60 hover:to-indigo-800/60 hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] transition-all text-center flex flex-col items-center gap-4 group relative overflow-hidden rounded-xl md:col-span-1 col-span-1 hover:scale-105 z-20 cursor-pointer">
                        <div className="absolute top-0 right-0 bg-fuchsia-400 text-black text-[12px] font-black px-4 py-1.5 rounded-bl-lg tracking-widest shadow-md">+ 25% BONUS</div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 animate-[shimmer_2s_infinite]"></div>
                        <Gem size={56} className="text-fuchsia-300 group-hover:scale-110 transition-transform relative z-10 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" />
                        <span className="text-5xl text-white font-black group-hover:text-fuchsia-200 relative z-10 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">15K</span>
                        <span className="text-sm text-fuchsia-100 bg-black/60 px-5 py-2 rounded-full border border-fuchsia-500/80 relative z-10 font-bold">$89.99</span>
                     </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Checkout Modal */}
        {checkoutOpen && selectedPackage && (
          <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => checkoutState === 'idle' && setCheckoutOpen(false)}>
             <div className="bg-[#0a0d14] border border-cyan-500/50 w-full max-w-md shadow-[0_0_80px_rgba(0,224,255,0.15)] flex flex-col rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-cyan-500/30 flex justify-between items-center font-code text-white bg-black/50">
                   <span className="flex items-center gap-2"><CreditCard size={18} className="text-cyan-400"/> SECURE PAYMENT GATEWAY</span>
                   {checkoutState === 'idle' && <button onClick={() => setCheckoutOpen(false)} className="text-gray-500 hover:text-white"><Plus size={20} className="rotate-45"/></button>}
                </div>
                
                {checkoutState === 'idle' && (
                  <div className="p-6 font-code space-y-6">
                    <div className="flex justify-between items-center p-4 bg-cyan-900/10 border border-cyan-500/30 rounded-lg">
                       <div>
                          <div className="text-gray-400 text-[10px] tracking-widest mb-1">PACKAGE SELECTED</div>
                          <div className="text-xl text-fuchsia-400 font-bold flex items-center gap-2"><Gem size={18}/> {selectedPackage.amount.toLocaleString()} CREDITS</div>
                       </div>
                       <div className="text-3xl text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">${selectedPackage.price}</div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="relative">
                          <label className="text-[10px] text-cyan-400 tracking-widest absolute -top-2 left-2 bg-[#0a0d14] px-1">CARD NUMBER</label>
                          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-black border border-gray-600 focus:border-cyan-400 rounded p-4 text-white outline-none tracking-widest font-mono text-lg placeholder-gray-700 transition-colors" />
                       </div>
                       <div className="flex gap-4">
                          <div className="relative flex-1">
                             <label className="text-[10px] text-cyan-400 tracking-widest absolute -top-2 left-2 bg-[#0a0d14] px-1">EXPIRY</label>
                             <input type="text" placeholder="MM/YY" className="w-full bg-black border border-gray-600 focus:border-cyan-400 rounded p-4 text-white outline-none tracking-widest font-mono text-lg placeholder-gray-700 transition-colors" />
                          </div>
                          <div className="relative flex-1">
                             <label className="text-[10px] text-cyan-400 tracking-widest absolute -top-2 left-2 bg-[#0a0d14] px-1">CVC</label>
                             <input type="password" placeholder="•••" className="w-full bg-black border border-gray-600 focus:border-cyan-400 rounded p-4 text-white outline-none tracking-widest font-mono text-lg placeholder-gray-700 transition-colors" />
                          </div>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setCheckoutState('processing');
                        setTimeout(() => {
                          setCheckoutState('success');
                          addPremiumCredits(selectedPackage.amount);
                          setTimeout(() => {
                            setCheckoutOpen(false);
                            setCheckoutState('idle');
                          }, 2500);
                        }, 2500);
                      }}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black p-4 rounded tracking-widest shadow-[0_0_20px_rgba(0,224,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 text-lg">
                      AUTHORIZE TRANSACTION
                    </button>
                  </div>
                )}
                
                {checkoutState === 'processing' && (
                  <div className="p-16 flex flex-col items-center justify-center space-y-6">
                     <Loader2 size={64} className="text-cyan-400 animate-spin" />
                     <div className="font-code text-cyan-400 text-center">
                        <div className="text-2xl font-bold mb-2">PROCESSING...</div>
                        <div className="text-xs text-gray-400 tracking-widest animate-pulse">ESTABLISHING SECURE UPLINK TO BANK</div>
                     </div>
                  </div>
                )}
                
                {checkoutState === 'success' && (
                  <div className="p-16 flex flex-col items-center justify-center space-y-6 bg-green-900/10 border-t-4 border-green-500">
                     <CheckCircle size={80} className="text-green-400 shadow-[0_0_40px_rgba(74,222,128,0.5)] rounded-full bg-green-900/30" />
                     <div className="font-code text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">APPROVED</div>
                        <div className="text-sm text-gray-300 bg-black/50 px-4 py-2 rounded-full border border-green-500/30">+{selectedPackage.amount.toLocaleString()} PREMIUM CREDITS</div>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </Router>
  );
}

export default App;
