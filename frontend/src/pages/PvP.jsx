import React, { useState, useEffect, useMemo } from 'react';
import { Swords, Shield, Zap, Trophy, TrendingUp, Users, Eye, Skull, Crown, ChevronUp, ChevronDown, Star, Target, Activity, Power, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

// ── PvP Rank Tiers ──
const RANKS = [
  { name: 'BRONZE', min: 0, max: 999, color: 'text-amber-600', border: 'border-amber-700/50', bg: 'bg-amber-900/10', glow: 'shadow-[0_0_15px_rgba(180,83,9,0.3)]', icon: '🥉' },
  { name: 'SILVER', min: 1000, max: 1999, color: 'text-gray-300', border: 'border-gray-400/50', bg: 'bg-gray-500/10', glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)]', icon: '🥈' },
  { name: 'GOLD', min: 2000, max: 2999, color: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-900/10', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]', icon: '🥇' },
  { name: 'PLATINUM', min: 3000, max: 3999, color: 'text-cyan-300', border: 'border-cyan-400/50', bg: 'bg-cyan-900/10', glow: 'shadow-[0_0_20px_rgba(0,224,255,0.3)]', icon: '💎' },
  { name: 'DIAMOND', min: 4000, max: 4999, color: 'text-fuchsia-300', border: 'border-fuchsia-400/50', bg: 'bg-fuchsia-900/10', glow: 'shadow-[0_0_20px_rgba(217,70,239,0.4)]', icon: '🔮' },
  { name: 'ELITE HACKER', min: 5000, max: 99999, color: 'text-red-400', border: 'border-red-500/60', bg: 'bg-red-900/10', glow: 'shadow-[0_0_25px_rgba(248,113,113,0.5)]', icon: '☠️' },
];

// ── Mock Match History ──
const MATCH_HISTORY = [
  { id: 1, opponent: 'Ph4nt0m_X', result: 'WIN', eloChange: +24, method: 'Payload Injection', duration: '2:34', ago: '12m' },
  { id: 2, opponent: 'CyberN1nja', result: 'LOSS', eloChange: -18, method: 'Firewall Breach', duration: '4:12', ago: '45m' },
  { id: 3, opponent: 'DarkReaper', result: 'WIN', eloChange: +31, method: 'SQL Exploit', duration: '1:58', ago: '2h' },
  { id: 4, opponent: 'NetW0rk_Bug', result: 'WIN', eloChange: +19, method: 'Brute Force', duration: '3:45', ago: '3h' },
  { id: 5, opponent: 'ZeroD4y', result: 'LOSS', eloChange: -22, method: 'Buffer Overflow', duration: '5:01', ago: '5h' },
  { id: 6, opponent: 'ShadowC0de', result: 'WIN', eloChange: +28, method: 'XSS Chain', duration: '2:11', ago: '8h' },
  { id: 7, opponent: 'Gh0stShell', result: 'WIN', eloChange: +15, method: 'MITM Attack', duration: '3:22', ago: '1d' },
  { id: 8, opponent: 'ByteKnight', result: 'LOSS', eloChange: -12, method: 'Rootkit Deploy', duration: '6:33', ago: '1d' },
];

// ── Mock Leaderboard ──
const LEADERBOARD = [
  { rank: 1, name: 'V0rt3x_M4ster', elo: 5420, wins: 342, losses: 89 },
  { rank: 2, name: 'N3tBl4de', elo: 5180, wins: 310, losses: 95 },
  { rank: 3, name: 'CryptK1ng', elo: 4890, wins: 289, losses: 102 },
  { rank: 4, name: 'D4rkPuls3', elo: 4650, wins: 275, losses: 110 },
  { rank: 5, name: 'Sh4dowR00t', elo: 4320, wins: 260, losses: 118 },
];

export default function PvP() {
  const agentInfo = useStore(s => s.agentInfo);
  const pvpEnabled = useStore(s => s.pvpEnabled);
  const togglePvp = useStore(s => s.togglePvp);
  const pvpStats = useStore(s => s.pvpStats);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState('overview'); // overview | history | leaderboard

  const currentRank = useMemo(() => {
    return RANKS.find(r => pvpStats.elo >= r.min && pvpStats.elo <= r.max) || RANKS[0];
  }, [pvpStats.elo]);

  const nextRank = useMemo(() => {
    const idx = RANKS.indexOf(currentRank);
    return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
  }, [currentRank]);

  const eloProgress = nextRank
    ? Math.round(((pvpStats.elo - currentRank.min) / (currentRank.max - currentRank.min + 1)) * 100)
    : 100;

  const winRate = pvpStats.wins + pvpStats.losses > 0
    ? Math.round((pvpStats.wins / (pvpStats.wins + pvpStats.losses)) * 100)
    : 0;

  const handleSearch = () => {
    if (!pvpEnabled) return;
    setSearching(true);
    setTimeout(() => setSearching(false), 4000);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-5 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-cyan-500/20 pb-4 gap-3">
        <div>
          <h1 className="text-2xl text-red-400 font-h1 flex items-center gap-2">
            <Swords size={28} className="drop-shadow-[0_0_10px_rgba(248,113,113,0.6)]" /> PVP_ARENA
          </h1>
          <p className="text-gray-400 font-body text-sm">Сразись с другими агентами. Поднимай рейтинг. Докажи превосходство.</p>
        </div>
        {/* PvP Toggle */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 px-5 py-2.5 border rounded-lg transition-all duration-500 ${pvpEnabled ? 'border-red-500/60 bg-red-900/20 shadow-[0_0_20px_rgba(248,113,113,0.2)]' : 'border-gray-700 bg-black/40'}`}>
            <Power size={16} className={pvpEnabled ? 'text-red-400' : 'text-gray-600'} />
            <span className={`font-code text-xs tracking-widest ${pvpEnabled ? 'text-red-400' : 'text-gray-500'}`}>
              PVP {pvpEnabled ? 'ACTIVE' : 'OFFLINE'}
            </span>
            <button
              onClick={togglePvp}
              className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-300 ${pvpEnabled ? 'bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.6)]' : 'bg-gray-700'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${pvpEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 font-code text-xs">
        {[
          { key: 'overview', label: 'OVERVIEW', icon: <Activity size={12} /> },
          { key: 'history', label: 'MATCH HISTORY', icon: <Eye size={12} /> },
          { key: 'leaderboard', label: 'LEADERBOARD', icon: <Crown size={12} /> },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all tracking-widest ${tab === t.key ? 'border-red-400 text-red-400 bg-red-400/5' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">

          {/* Rank Card */}
          <div className={`glass-panel border ${currentRank.border} ${currentRank.glow} p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
            <div className="text-5xl">{currentRank.icon}</div>
            <div>
              <div className={`font-h1 text-2xl ${currentRank.color} tracking-widest drop-shadow-[0_0_15px_currentColor]`}>{currentRank.name}</div>
              <div className="font-code text-gray-400 text-sm mt-1">{pvpStats.elo} ELO</div>
            </div>
            {nextRank && (
              <div className="w-full mt-2">
                <div className="flex justify-between font-code text-[10px] text-gray-500 mb-1.5">
                  <span>{currentRank.name}</span>
                  <span>{nextRank.name} ({nextRank.min} ELO)</span>
                </div>
                <div className="w-full h-2 bg-black/60 border border-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-red-500 to-fuchsia-500 shadow-[0_0_8px_rgba(248,113,113,0.6)]`} style={{ width: `${eloProgress}%` }}></div>
                </div>
                <div className="font-code text-[10px] text-gray-600 text-center mt-1">{nextRank.min - pvpStats.elo} ELO до повышения</div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="glass-panel border border-cyan-500/15 p-5 flex flex-col gap-4">
            <h3 className="font-code text-xs text-gray-400 tracking-widest border-b border-cyan-500/10 pb-2 flex items-center gap-2"><TrendingUp size={14} className="text-cyan-400" /> STATISTICS</h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="p-3 border border-secondary-container/20 bg-secondary-container/5 text-center">
                <div className="font-code text-2xl text-secondary-container font-bold">{pvpStats.wins}</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest">WINS</div>
              </div>
              <div className="p-3 border border-red-500/20 bg-red-400/5 text-center">
                <div className="font-code text-2xl text-red-400 font-bold">{pvpStats.losses}</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest">LOSSES</div>
              </div>
              <div className="p-3 border border-cyan-500/20 bg-cyan-400/5 text-center">
                <div className="font-code text-2xl text-cyan-400 font-bold">{winRate}%</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest">WIN RATE</div>
              </div>
              <div className="p-3 border border-fuchsia-500/20 bg-fuchsia-400/5 text-center">
                <div className="font-code text-2xl text-fuchsia-400 font-bold">{pvpStats.streak}</div>
                <div className="font-code text-[10px] text-gray-500 tracking-widest">WIN STREAK</div>
              </div>
            </div>
            <div className="flex justify-between font-code text-[10px] text-gray-500 pt-2 border-t border-cyan-500/10">
              <span>TOTAL MATCHES: {pvpStats.wins + pvpStats.losses}</span>
              <span>SEASON 1</span>
            </div>
          </div>

          {/* Matchmaking Card */}
          <div className="glass-panel border border-cyan-500/15 p-5 flex flex-col gap-4">
            <h3 className="font-code text-xs text-gray-400 tracking-widest border-b border-cyan-500/10 pb-2 flex items-center gap-2"><Search size={14} className="text-red-400" /> MATCHMAKING</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              {!pvpEnabled ? (
                <div className="text-center">
                  <Power size={48} className="text-gray-700 mx-auto mb-3" />
                  <p className="font-code text-sm text-gray-500">PVP MODE DISABLED</p>
                  <p className="font-body text-xs text-gray-600 mt-1">Включите PvP режим для поиска противника</p>
                </div>
              ) : searching ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-4 shadow-[0_0_20px_rgba(248,113,113,0.3)]"></div>
                  <p className="font-code text-sm text-red-400 animate-pulse tracking-widest">SEARCHING...</p>
                  <p className="font-body text-xs text-gray-500 mt-1">Поиск противника в диапазоне {pvpStats.elo - 200}–{pvpStats.elo + 200} ELO</p>
                  <button onClick={() => setSearching(false)} className="mt-4 px-6 py-2 border border-gray-600 text-gray-400 font-code text-xs hover:border-red-500 hover:text-red-400 transition-all">CANCEL</button>
                </div>
              ) : (
                <div className="text-center">
                  <Swords size={48} className="text-red-400/40 mx-auto mb-3" />
                  <p className="font-body text-xs text-gray-500 mb-4">Найди и атакуй вражеского агента</p>
                  <button onClick={handleSearch}
                    className="px-8 py-3 bg-red-500 text-white font-code text-sm tracking-widest font-bold hover:bg-red-400 hover:shadow-[0_0_30px_rgba(248,113,113,0.5)] active:scale-95 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Target size={16} /> FIND OPPONENT
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 font-code text-[10px] text-gray-600 border-t border-cyan-500/10 pt-3">
              <Users size={10} /> <span>Онлайн: <span className="text-cyan-400">2,847</span> агентов</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MATCH HISTORY TAB ═══ */}
      {tab === 'history' && (
        <div className="glass-panel border border-cyan-500/15 p-5 flex-1">
          <div className="space-y-2">
            {MATCH_HISTORY.map(m => (
              <div key={m.id} className={`flex items-center justify-between p-3 border transition-all hover:bg-white/[0.02] ${m.result === 'WIN' ? 'border-secondary-container/20 hover:border-secondary-container/40' : 'border-red-500/20 hover:border-red-500/40'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${m.result === 'WIN' ? 'bg-secondary-container/10 text-secondary-container border border-secondary-container/30' : 'bg-red-400/10 text-red-400 border border-red-500/30'}`}>
                    {m.result === 'WIN' ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className="font-code text-sm text-white font-bold">{m.opponent}</div>
                    <div className="font-code text-[10px] text-gray-500">{m.method} • {m.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`font-code text-sm font-bold flex items-center gap-1 ${m.eloChange > 0 ? 'text-secondary-container' : 'text-red-400'}`}>
                    {m.eloChange > 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {m.eloChange > 0 ? '+' : ''}{m.eloChange}
                  </div>
                  <span className="font-code text-[10px] text-gray-600 w-10 text-right">{m.ago}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ LEADERBOARD TAB ═══ */}
      {tab === 'leaderboard' && (
        <div className="glass-panel border border-cyan-500/15 p-5 flex-1">
          <div className="space-y-2">
            {LEADERBOARD.map((p, i) => {
              const rank = RANKS.find(r => p.elo >= r.min && p.elo <= r.max) || RANKS[0];
              return (
                <div key={p.rank} className={`flex items-center justify-between p-4 border transition-all hover:bg-white/[0.03] ${i === 0 ? 'border-yellow-500/30 bg-yellow-900/5' : i === 1 ? 'border-gray-400/20 bg-gray-500/5' : i === 2 ? 'border-amber-600/20 bg-amber-900/5' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center font-code font-bold text-lg ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {i < 3 ? ['👑', '🥈', '🥉'][i] : `#${p.rank}`}
                    </div>
                    <div>
                      <div className="font-code text-sm text-white font-bold">{p.name}</div>
                      <div className={`font-code text-[10px] ${rank.color}`}>{rank.icon} {rank.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-code text-sm text-cyan-400 font-bold">{p.elo}</div>
                      <div className="font-code text-[10px] text-gray-500">ELO</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="font-code text-xs text-gray-300">{p.wins}W / {p.losses}L</div>
                      <div className="font-code text-[10px] text-gray-600">{Math.round((p.wins / (p.wins + p.losses)) * 100)}% WR</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Your position */}
            <div className="border-t border-cyan-500/15 pt-3 mt-3">
              <div className="flex items-center justify-between p-4 border border-cyan-500/30 bg-cyan-400/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center font-code text-cyan-400 font-bold">#247</div>
                  <div>
                    <div className="font-code text-sm text-cyan-400 font-bold">{agentInfo.username} (YOU)</div>
                    <div className={`font-code text-[10px] ${currentRank.color}`}>{currentRank.icon} {currentRank.name}</div>
                  </div>
                </div>
                <div className="font-code text-sm text-cyan-400 font-bold">{pvpStats.elo} ELO</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
