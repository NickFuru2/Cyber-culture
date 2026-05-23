import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { Shield, Crosshair, ChevronRight, Lock, Unlock, Loader2, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Registration = () => {
  const register = useStore(state => state.register);
  const setAgentData = useStore(state => state.setAgentData);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [faction, setFaction] = useState(null);
  const [hoveredSide, setHoveredSide] = useState(null);
  const [phase, setPhase] = useState('choose'); // 'choose' | 'register' | 'login'
  const [glitchText, setGlitchText] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('register'); // 'register' | 'login'

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
    setTimeout(() => {
      setPhase('register');
      setMode('register'); // Default to register mode
    }, 800);
  }, []);

  // Direct login mode — skip faction selection
  const handleDirectLogin = useCallback(() => {
    setPhase('login');
    setMode('login');
    setFaction(null);
    setError('');
    setUsername('');
    setPassword('');
  }, []);

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password required');
      return;
    }

    // For register mode, faction is required
    if (mode === 'register' && !faction) {
      setError('Please select a faction first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = mode === 'register'
        ? { username, password, alignment: faction }
        : { username, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Accept HTTP-only cookie from server
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Update store with agent data (JWT is in HTTP-only cookie, managed by server)
      if (setAgentData) {
        setAgentData(data.agent);
      }

      // Legacy register call for compatibility
      register(data.agent.username, data.agent.alignment);

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Connection timed out. Is the server running?');
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Cannot connect to server. Make sure backend is running on port 4000.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPhase('choose');
    setFaction(null);
    setHoveredSide(null);
    setError('');
    setPassword('');
    setUsername('');
    whiteVideoRef.current?.pause();
    redVideoRef.current?.pause();
  };

  // Determine expansion ratios
  const getWhiteWidth = () => {
    if (phase === 'login') return '50%'; // Neutral when in login mode
    if (faction === 'WHITE HAT') return '70%';
    if (faction === 'BLACK HAT') return '30%';
    if (hoveredSide === 'white') return '60%';
    if (hoveredSide === 'red') return '40%';
    return '50%';
  };

  const getRedWidth = () => {
    if (phase === 'login') return '50%'; // Neutral when in login mode
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
        onMouseEnter={() => phase === 'choose' && handleSideHover('white')}
        onMouseLeave={() => phase === 'choose' && handleSideLeave('white')}
        onClick={() => !faction && phase === 'choose' && handleFactionSelect('white')}
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
            filter: phase === 'login'
              ? 'brightness(0.2) saturate(0.3)'
              : faction === 'BLACK HAT' 
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
        <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 p-6 transition-opacity duration-500 ${phase === 'login' ? 'opacity-30' : 'opacity-100'}`}>
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
          {!faction && phase === 'choose' && (
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
            faction || phase === 'login'
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
        onMouseEnter={() => phase === 'choose' && handleSideHover('red')}
        onMouseLeave={() => phase === 'choose' && handleSideLeave('red')}
        onClick={() => !faction && phase === 'choose' && handleFactionSelect('red')}
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
            filter: phase === 'login'
              ? 'brightness(0.2) saturate(0.3)'
              : faction === 'WHITE HAT' 
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
        <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 p-6 transition-opacity duration-500 ${phase === 'login' ? 'opacity-30' : 'opacity-100'}`}>
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
          {!faction && phase === 'choose' && (
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

      {/* === REGISTRATION PANEL (OVERLAY — after faction select) === */}
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
                  {mode === 'register' ? 'INITIALIZE AGENT' : 'AGENT LOGIN'}
                </h1>
              </div>
              <p className="text-gray-500 font-code text-[10px] tracking-[0.3em]">
                FACTION: {faction || '---'} // {mode === 'register' ? 'REGISTRATION' : 'AUTHENTICATION'} PROTOCOL V2.0
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-black/60 border border-gray-700 rounded">
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-2 font-code text-xs tracking-widest transition-all ${
                  mode === 'register'
                    ? faction === 'WHITE HAT'
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                REGISTER
              </button>
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 font-code text-xs tracking-widest transition-all ${
                  mode === 'login'
                    ? faction === 'WHITE HAT'
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                LOGIN
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs font-code">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Codename input */}
            <div className="flex flex-col gap-2">
              <label className={`font-code text-xs tracking-widest ${
                faction === 'WHITE HAT' ? 'text-cyan-400/80' : 'text-red-400/80'
              }`}>
                CODENAME
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
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAuth()}
                placeholder="e.g. Neo, Trinity..."
                maxLength={16}
                autoFocus
                disabled={loading}
              />
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-2">
              <label className={`font-code text-xs tracking-widest ${
                faction === 'WHITE HAT' ? 'text-cyan-400/80' : 'text-red-400/80'
              }`}>
                ACCESS KEY
              </label>
              <input
                type="password"
                className="bg-black/60 border p-3 font-code outline-none transition-all"
                style={{
                  borderColor: faction === 'WHITE HAT' ? 'rgba(0,224,255,0.3)' : 'rgba(255,0,0,0.3)',
                  color: faction === 'WHITE HAT' ? '#67e8f9' : '#f87171',
                  boxShadow: password
                    ? faction === 'WHITE HAT'
                      ? '0 0 15px rgba(0,224,255,0.15)'
                      : '0 0 15px rgba(255,0,0,0.15)'
                    : 'none',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAuth()}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Auth button */}
            <button
              onClick={handleAuth}
              disabled={!username.trim() || !password.trim() || loading}
              className={`mt-2 font-code font-bold py-3 tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${
                faction === 'WHITE HAT'
                  ? 'bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(0,224,255,0.5)]'
                  : 'bg-red-500 text-black hover:bg-red-400 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  {mode === 'register' ? 'ENTER THE GRID' : 'ACCESS SYSTEM'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            {/* Back button */}
            <button
              onClick={handleBack}
              disabled={loading}
              className="font-code text-[10px] text-gray-500 hover:text-white tracking-[0.2em] transition-colors text-center disabled:opacity-30 flex items-center justify-center gap-1"
            >
              <ArrowLeft size={10} />
              CHANGE FACTION
            </button>
          </div>
        </div>
      </div>

      {/* === LOGIN PANEL (OVERLAY — direct login without faction) === */}
      <div 
        className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-700 ${
          phase === 'login' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className={`relative pointer-events-auto transition-all duration-700 ${
            phase === 'login' 
              ? 'translate-y-0 scale-100 opacity-100' 
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          {/* Glass panel — neutral cyan theme */}
          <div 
            className="w-[420px] max-w-[90vw] p-8 flex flex-col gap-6"
            style={{
              background: 'rgba(10, 13, 20, 0.9)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,224,255,0.25)',
              boxShadow: '0 0 60px rgba(0,224,255,0.1), inset 0 1px 0 rgba(0,224,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <LogIn size={28} className="text-cyan-400" />
                <h1 className="text-2xl font-h1 tracking-[0.2em] text-cyan-400"
                style={{
                  textShadow: '0 0 15px rgba(0,224,255,0.6)',
                }}>
                  AGENT LOGIN
                </h1>
              </div>
              <p className="text-gray-500 font-code text-[10px] tracking-[0.3em]">
                AUTHENTICATION PROTOCOL V2.0 // WELCOME BACK
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs font-code">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Codename input */}
            <div className="flex flex-col gap-2">
              <label className="font-code text-xs tracking-widest text-cyan-400/80">
                CODENAME
              </label>
              <input
                className="bg-black/60 border p-3 font-code outline-none transition-all"
                style={{
                  borderColor: 'rgba(0,224,255,0.3)',
                  color: '#67e8f9',
                  boxShadow: username ? '0 0 15px rgba(0,224,255,0.15)' : 'none',
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAuth()}
                placeholder="e.g. Neo, Trinity..."
                maxLength={16}
                autoFocus
                disabled={loading}
              />
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-2">
              <label className="font-code text-xs tracking-widest text-cyan-400/80">
                ACCESS KEY
              </label>
              <input
                type="password"
                className="bg-black/60 border p-3 font-code outline-none transition-all"
                style={{
                  borderColor: 'rgba(0,224,255,0.3)',
                  color: '#67e8f9',
                  boxShadow: password ? '0 0 15px rgba(0,224,255,0.15)' : 'none',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAuth()}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Login button */}
            <button
              onClick={handleAuth}
              disabled={!username.trim() || !password.trim() || loading}
              className="mt-2 font-code font-bold py-3 tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(0,224,255,0.5)]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  ACCESS SYSTEM
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            {/* Back button */}
            <button
              onClick={handleBack}
              disabled={loading}
              className="font-code text-[10px] text-gray-500 hover:text-white tracking-[0.2em] transition-colors text-center disabled:opacity-30 flex items-center justify-center gap-1"
            >
              <ArrowLeft size={10} />
              BACK TO FACTION SELECT
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
          
          {/* Login button in bottom center — visible only in 'choose' phase */}
          {phase === 'choose' && (
            <button
              onClick={handleDirectLogin}
              className="pointer-events-auto font-code text-[11px] text-cyan-400/70 hover:text-cyan-300 tracking-[0.15em] transition-all duration-300 flex items-center gap-2 bg-cyan-400/5 hover:bg-cyan-400/15 border border-cyan-400/20 hover:border-cyan-400/50 px-5 py-2.5 hover:shadow-[0_0_20px_rgba(0,224,255,0.2)] group"
            >
              <LogIn size={14} className="group-hover:scale-110 transition-transform" />
              ALREADY AN AGENT? LOGIN
            </button>
          )}

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
            {phase === 'login' ? 'AGENT AUTHENTICATION' : 'SELECT YOUR ALLEGIANCE'}
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
