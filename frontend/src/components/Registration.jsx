import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { Shield, Crosshair, ChevronRight, Lock, Unlock } from 'lucide-react';

const Registration = () => {
  const register = useStore(state => state.register);
  const [username, setUsername] = useState('');
  const [faction, setFaction] = useState(null);
  const [hoveredSide, setHoveredSide] = useState(null);
  const [phase, setPhase] = useState('choose'); // 'choose' | 'register'
  const [glitchText, setGlitchText] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const whiteVideoRef = useRef(null);
  const redVideoRef = useRef(null);

  // Glitch text effect on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    setTimeout(() => setIsReady(true), 300);
  }, []);

  const handleSideHover = useCallback((side) => {
    setHoveredSide(side);
    if (side === 'white' && whiteVideoRef.current) {
      whiteVideoRef.current.play().catch(() => {});
    } else if (side === 'red' && redVideoRef.current) {
      redVideoRef.current.play().catch(() => {});
    }
  }, []);

  const handleSideLeave = useCallback((side) => {
    if (faction) return; // Don't pause if already selected
    setHoveredSide(null);
    if (side === 'white' && whiteVideoRef.current) {
      whiteVideoRef.current.pause();
    } else if (side === 'red' && redVideoRef.current) {
      redVideoRef.current.pause();
    }
  }, [faction]);

  const handleFactionSelect = useCallback((side) => {
    const factionName = side === 'white' ? 'WHITE HAT' : 'BLACK HAT';
    setFaction(factionName);
    setHoveredSide(side);

    // Play the selected video, pause the other
    if (side === 'white') {
      whiteVideoRef.current?.play().catch(() => {});
      redVideoRef.current?.pause();
    } else {
      redVideoRef.current?.play().catch(() => {});
      whiteVideoRef.current?.pause();
    }

    // Transition to register phase after a beat
    setTimeout(() => setPhase('register'), 800);
  }, []);

  const handleRegister = () => {
    if (username.trim() && faction) {
      register(username, faction);
    }
  };

  const handleBack = () => {
    setPhase('choose');
    setFaction(null);
    setHoveredSide(null);
    whiteVideoRef.current?.pause();
    redVideoRef.current?.pause();
  };

  // Determine expansion ratios
  const getWhiteWidth = () => {
    if (faction === 'WHITE HAT') return '70%';
    if (faction === 'BLACK HAT') return '30%';
    if (hoveredSide === 'white') return '60%';
    if (hoveredSide === 'red') return '40%';
    return '50%';
  };

  const getRedWidth = () => {
    if (faction === 'BLACK HAT') return '70%';
    if (faction === 'WHITE HAT') return '30%';
    if (hoveredSide === 'red') return '60%';
    if (hoveredSide === 'white') return '40%';
    return '50%';
  };

  return (
    <div className={`h-screen w-screen bg-black flex overflow-hidden transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* === WHITE HAT SIDE === */}
      <div
        className="relative h-full cursor-pointer group overflow-hidden"
        style={{
          width: getWhiteWidth(),
          transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onMouseEnter={() => handleSideHover('white')}
        onMouseLeave={() => handleSideLeave('white')}
        onClick={() => !faction && handleFactionSelect('white')}
      >
        {/* Video Background */}
        <video
          ref={whiteVideoRef}
          src="/WhiteTeam.mp4"
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: faction === 'BLACK HAT' 
              ? 'brightness(0.15) saturate(0.3)' 
              : hoveredSide === 'white' 
                ? 'brightness(0.6) saturate(1.2)' 
                : 'brightness(0.35) saturate(0.7)',
            transition: 'filter 0.6s ease',
          }}
        />

        {/* Cyan overlay gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: faction === 'WHITE HAT'
              ? 'linear-gradient(135deg, rgba(0,224,255,0.15) 0%, transparent 60%)'
              : hoveredSide === 'white'
                ? 'linear-gradient(135deg, rgba(0,224,255,0.1) 0%, transparent 50%)'
                : 'linear-gradient(135deg, rgba(0,224,255,0.05) 0%, transparent 40%)',
            transition: 'background 0.6s ease',
          }}
        />

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
          {/* Icon */}
          <div 
            className={`mb-6 transition-all duration-700 ${
              faction === 'WHITE HAT' ? 'scale-125' : hoveredSide === 'white' ? 'scale-110' : 'scale-100'
            }`}
          >
            <Shield 
              size={faction === 'WHITE HAT' ? 80 : 64} 
              className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,224,255,0.8)]"
              style={{
                filter: hoveredSide === 'white' || faction === 'WHITE HAT'
                  ? 'drop-shadow(0 0 30px rgba(0,224,255,0.9))'
                  : 'none',
                transition: 'all 0.5s ease',
              }}
            />
          </div>

          {/* Title */}
          <h2 
            className={`font-h1 tracking-[0.3em] text-white mb-2 transition-all duration-500 ${
              glitchText ? 'translate-x-[2px] skew-x-2' : ''
            } ${faction === 'WHITE HAT' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-4xl'}`}
            style={{
              textShadow: hoveredSide === 'white' || faction === 'WHITE HAT'
                ? '0 0 20px rgba(0,224,255,0.8), 0 0 40px rgba(0,224,255,0.4)'
                : '0 0 10px rgba(0,224,255,0.3)',
            }}
          >
            WHITE HAT
          </h2>

          {/* Subtitle */}
          <p className={`font-code text-cyan-300/70 tracking-[0.2em] text-xs md:text-sm transition-all duration-500 ${
            faction === 'BLACK HAT' ? 'opacity-30' : 'opacity-100'
          }`}>
            DEFENDERS
          </p>

          {/* Description - visible on hover or select */}
          <div className={`mt-6 max-w-xs text-center transition-all duration-500 ${
            hoveredSide === 'white' || faction === 'WHITE HAT' 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}>
            <p className="font-code text-xs text-cyan-200/60 leading-relaxed">
              Protect systems. Defend networks. Uphold the code. Join the shield that guards the digital frontier.
            </p>
          </div>

          {/* Click prompt */}
          {!faction && (
            <div className={`mt-8 font-code text-[10px] tracking-[0.3em] transition-all duration-500 ${
              hoveredSide === 'white' 
                ? 'text-cyan-400 opacity-100 translate-y-0' 
                : 'text-cyan-400/30 opacity-0 translate-y-2'
            }`}>
              <div className="flex items-center gap-2 animate-pulse">
                <Unlock size={12} />
                [ CLICK TO JOIN ]
              </div>
            </div>
          )}

          {/* Selected badge */}
          {faction === 'WHITE HAT' && (
            <div className="mt-6 flex items-center gap-2 font-code text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-4 py-2 animate-pulse">
              <Lock size={12} />
              FACTION LOCKED
            </div>
          )}
        </div>

        {/* Border glow on right edge */}
        <div 
          className="absolute top-0 right-0 w-[2px] h-full z-20 pointer-events-none"
          style={{
            background: hoveredSide === 'white' || faction === 'WHITE HAT'
              ? 'linear-gradient(180deg, transparent 0%, rgba(0,224,255,0.8) 30%, rgba(0,224,255,0.8) 70%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(0,224,255,0.2) 30%, rgba(0,224,255,0.2) 70%, transparent 100%)',
            boxShadow: hoveredSide === 'white' || faction === 'WHITE HAT'
              ? '0 0 15px rgba(0,224,255,0.6), 0 0 30px rgba(0,224,255,0.3)'
              : 'none',
            transition: 'all 0.6s ease',
          }}
        />
      </div>

      {/* === CENTER DIVIDER === */}
      <div className="relative z-30 flex items-center justify-center" style={{ width: '0px' }}>
        {/* VS Badge */}
        <div 
          className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-700 ${
            faction 
              ? 'scale-0 opacity-0' 
              : 'scale-100 opacity-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(16,20,26,1) 0%, rgba(0,0,0,0.9) 100%)',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          <span className="font-h1 text-white/60 text-lg tracking-widest">VS</span>
        </div>
      </div>

      {/* === RED/BLACK HAT SIDE === */}
      <div
        className="relative h-full cursor-pointer group overflow-hidden"
        style={{
          width: getRedWidth(),
          transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onMouseEnter={() => handleSideHover('red')}
        onMouseLeave={() => handleSideLeave('red')}
        onClick={() => !faction && handleFactionSelect('red')}
      >
        {/* Video Background */}
        <video
          ref={redVideoRef}
          src="/RedTeam.mp4"
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: faction === 'WHITE HAT' 
              ? 'brightness(0.15) saturate(0.3)' 
              : hoveredSide === 'red' 
                ? 'brightness(0.6) saturate(1.2)' 
                : 'brightness(0.35) saturate(0.7)',
            transition: 'filter 0.6s ease',
          }}
        />

        {/* Red overlay gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: faction === 'BLACK HAT'
              ? 'linear-gradient(225deg, rgba(255,0,0,0.15) 0%, transparent 60%)'
              : hoveredSide === 'red'
                ? 'linear-gradient(225deg, rgba(255,0,0,0.1) 0%, transparent 50%)'
                : 'linear-gradient(225deg, rgba(255,0,0,0.05) 0%, transparent 40%)',
            transition: 'background 0.6s ease',
          }}
        />

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
          {/* Icon */}
          <div 
            className={`mb-6 transition-all duration-700 ${
              faction === 'BLACK HAT' ? 'scale-125' : hoveredSide === 'red' ? 'scale-110' : 'scale-100'
            }`}
          >
            <Crosshair 
              size={faction === 'BLACK HAT' ? 80 : 64} 
              className="text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
              style={{
                filter: hoveredSide === 'red' || faction === 'BLACK HAT'
                  ? 'drop-shadow(0 0 30px rgba(255,0,0,0.9))'
                  : 'none',
                transition: 'all 0.5s ease',
              }}
            />
          </div>

          {/* Title */}
          <h2 
            className={`font-h1 tracking-[0.3em] text-white mb-2 transition-all duration-500 ${
              glitchText ? '-translate-x-[2px] -skew-x-2' : ''
            } ${faction === 'BLACK HAT' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-4xl'}`}
            style={{
              textShadow: hoveredSide === 'red' || faction === 'BLACK HAT'
                ? '0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(255,0,0,0.4)'
                : '0 0 10px rgba(255,0,0,0.3)',
            }}
          >
            BLACK HAT
          </h2>

          {/* Subtitle */}
          <p className={`font-code text-red-400/70 tracking-[0.2em] text-xs md:text-sm transition-all duration-500 ${
            faction === 'WHITE HAT' ? 'opacity-30' : 'opacity-100'
          }`}>
            ATTACKERS
          </p>

          {/* Description */}
          <div className={`mt-6 max-w-xs text-center transition-all duration-500 ${
            hoveredSide === 'red' || faction === 'BLACK HAT' 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}>
            <p className="font-code text-xs text-red-200/60 leading-relaxed">
              Exploit weaknesses. Breach defenses. Master the shadows. Become the predator in the digital underworld.
            </p>
          </div>

          {/* Click prompt */}
          {!faction && (
            <div className={`mt-8 font-code text-[10px] tracking-[0.3em] transition-all duration-500 ${
              hoveredSide === 'red' 
                ? 'text-red-400 opacity-100 translate-y-0' 
                : 'text-red-400/30 opacity-0 translate-y-2'
            }`}>
              <div className="flex items-center gap-2 animate-pulse">
                <Unlock size={12} />
                [ CLICK TO JOIN ]
              </div>
            </div>
          )}

          {/* Selected badge */}
          {faction === 'BLACK HAT' && (
            <div className="mt-6 flex items-center gap-2 font-code text-xs text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-2 animate-pulse">
              <Lock size={12} />
              FACTION LOCKED
            </div>
          )}
        </div>

        {/* Border glow on left edge */}
        <div 
          className="absolute top-0 left-0 w-[2px] h-full z-20 pointer-events-none"
          style={{
            background: hoveredSide === 'red' || faction === 'BLACK HAT'
              ? 'linear-gradient(180deg, transparent 0%, rgba(255,0,0,0.8) 30%, rgba(255,0,0,0.8) 70%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(255,0,0,0.2) 30%, rgba(255,0,0,0.2) 70%, transparent 100%)',
            boxShadow: hoveredSide === 'red' || faction === 'BLACK HAT'
              ? '0 0 15px rgba(255,0,0,0.6), 0 0 30px rgba(255,0,0,0.3)'
              : 'none',
            transition: 'all 0.6s ease',
          }}
        />
      </div>

      {/* === REGISTRATION PANEL (OVERLAY) === */}
      <div 
        className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-700 ${
          phase === 'register' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className={`relative pointer-events-auto transition-all duration-700 ${
            phase === 'register' 
              ? 'translate-y-0 scale-100 opacity-100' 
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          {/* Glass panel */}
          <div 
            className="w-[420px] max-w-[90vw] p-8 flex flex-col gap-6"
            style={{
              background: 'rgba(10, 13, 20, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${faction === 'WHITE HAT' ? 'rgba(0,224,255,0.3)' : 'rgba(255,0,0,0.3)'}`,
              boxShadow: faction === 'WHITE HAT' 
                ? '0 0 60px rgba(0,224,255,0.15), inset 0 1px 0 rgba(0,224,255,0.1)'
                : '0 0 60px rgba(255,0,0,0.15), inset 0 1px 0 rgba(255,0,0,0.1)',
            }}
          >
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                {faction === 'WHITE HAT' 
                  ? <Shield size={28} className="text-cyan-400" /> 
                  : <Crosshair size={28} className="text-red-500" />
                }
                <h1 className={`text-2xl font-h1 tracking-[0.2em] ${
                  faction === 'WHITE HAT' ? 'text-cyan-400' : 'text-red-400'
                }`}
                style={{
                  textShadow: faction === 'WHITE HAT'
                    ? '0 0 15px rgba(0,224,255,0.6)'
                    : '0 0 15px rgba(255,0,0,0.6)',
                }}>
                  INITIALIZE AGENT
                </h1>
              </div>
              <p className="text-gray-500 font-code text-[10px] tracking-[0.3em]">
                FACTION: {faction || '---'} // REGISTRATION PROTOCOL V2.0
              </p>
            </div>

            {/* Codename input */}
            <div className="flex flex-col gap-2">
              <label className={`font-code text-xs tracking-widest ${
                faction === 'WHITE HAT' ? 'text-cyan-400/80' : 'text-red-400/80'
              }`}>
                CHOOSE CODENAME
              </label>
              <input 
                className="bg-black/60 border p-3 font-code outline-none transition-all"
                style={{
                  borderColor: faction === 'WHITE HAT' ? 'rgba(0,224,255,0.3)' : 'rgba(255,0,0,0.3)',
                  color: faction === 'WHITE HAT' ? '#67e8f9' : '#f87171',
                  boxShadow: username 
                    ? faction === 'WHITE HAT' 
                      ? '0 0 15px rgba(0,224,255,0.15)' 
                      : '0 0 15px rgba(255,0,0,0.15)'
                    : 'none',
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                placeholder="e.g. Neo, Trinity..."
                maxLength={16}
                autoFocus
              />
            </div>

            {/* Register button */}
            <button 
              onClick={handleRegister}
              disabled={!username.trim()}
              className={`mt-2 font-code font-bold py-3 tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${
                faction === 'WHITE HAT'
                  ? 'bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(0,224,255,0.5)]'
                  : 'bg-red-500 text-black hover:bg-red-400 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]'
              }`}
            >
              ENTER THE GRID
              <ChevronRight size={16} />
            </button>

            {/* Back button */}
            <button 
              onClick={handleBack}
              className="font-code text-[10px] text-gray-500 hover:text-white tracking-[0.2em] transition-colors text-center"
            >
              ← CHANGE FACTION
            </button>
          </div>
        </div>
      </div>

      {/* === BOTTOM HUD === */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* Bottom gradient fade */}
        <div className="h-32 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-6 md:px-10 pb-4">
          <div className="font-code text-[9px] text-gray-600 tracking-widest">
            <div>SYS.AUTH_GATEWAY v2.0</div>
            <div className="mt-1">UPLINK: <span className="text-green-500">ACTIVE</span></div>
          </div>
          <div className="font-code text-[9px] text-gray-600 tracking-widest text-right">
            <div>CYBER-OPS PLATFORM</div>
            <div className="mt-1">NODES ONLINE: <span className="text-cyan-400">1,337</span></div>
          </div>
        </div>
      </div>

      {/* === TOP HUD === */}
      <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="h-20 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-5">
          <div className="font-code text-[10px] text-gray-500 tracking-[0.4em]">
            SELECT YOUR ALLEGIANCE
          </div>
        </div>
      </div>

      {/* Global scanline overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
        }}
      />
    </div>
  );
};

export default Registration;
