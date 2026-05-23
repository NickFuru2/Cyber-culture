import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Обёртка для fetch с поддержкой HTTP-only cookie (credentials: 'include').
 * Все запросы к API автоматически включают cookie с JWT-токеном.
 */
async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include', // Отправляем HTTP-only cookie автоматически
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

export const useStore = create((set, get) => ({
  isLoggedIn: false,
  language: 'EN',
  streamerMode: false,
  loadError: null, // Track loading errors for UI feedback
  
  // UI & Audio Customization
  soundFxEnabled: localStorage.getItem('cyber_ops_sound_fx') !== 'false',
  toggleSoundFx: () => {
    const nextVal = !get().soundFxEnabled;
    localStorage.setItem('cyber_ops_sound_fx', String(nextVal));
    set({ soundFxEnabled: nextVal });
  },
  
  theme: localStorage.getItem('cyber_ops_theme') || 'cyan',
  setTheme: (theme) => {
    localStorage.setItem('cyber_ops_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  agentInfo: {
    username: "UNKNOWN",
    alignment: "UNASSIGNED",
    level: 1,
    title: "RECRUIT",
    xp: 0,
    gameCredits: 500,
    premiumCredits: 0,
    nextLevelXp: 1000,
  },
  missions: [],
  inventory: [],
  skillPoints: 3,
  unlockedSkills: [],

  // PvP State
  pvpEnabled: false,
  pvpStats: { elo: 1000, wins: 0, losses: 0, streak: 0 },
  togglePvp: async () => {
    try {
      const response = await apiFetch('/api/pvp/toggle', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        set({ pvpEnabled: data.pvpEnabled });
      } else {
        set((state) => ({ pvpEnabled: !state.pvpEnabled }));
      }
    } catch {
      set((state) => ({ pvpEnabled: !state.pvpEnabled }));
    }
  },

  // XP Activity Log — tracks recent XP gains from various sources
  xpLog: [],

  // Leaderboard & MMO States
  leaderboard: [],
  chatMessages: [],

  // Set agent data from API (with safe defaults)
  setAgentData: (agent) => {
    set({
      isLoggedIn: true,
      loadError: null,
      agentInfo: {
        username: agent.username || 'UNKNOWN',
        alignment: agent.alignment || 'UNASSIGNED',
        level: agent.level || 1,
        title: agent.title || 'RECRUIT',
        xp: agent.xp || 0,
        gameCredits: agent.gameCredits ?? 500,
        premiumCredits: agent.premiumCredits ?? 0,
        nextLevelXp: agent.nextLevelXp || 1000,
      },
      skillPoints: agent.skillPoints ?? 3,
      unlockedSkills: agent.unlockedSkills || [],
      xpLog: agent.xpLog || [],
      pvpStats: {
        elo: agent.pvpElo || 1000,
        wins: agent.pvpWins || 0,
        losses: agent.pvpLosses || 0,
        streak: agent.pvpStreak || 0,
      },
      pvpEnabled: agent.pvpEnabled === true,
    });
    
    // Auto-apply current theme setting on mount
    const savedTheme = localStorage.getItem('cyber_ops_theme') || 'cyan';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },

  // Load agent profile from API (cookie-based auth)
  loadAgentProfile: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await apiFetch('/api/agent/me', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid — clear auth
          set({ isLoggedIn: false, loadError: null });
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      get().setAgentData(data);
    } catch (error) {
      console.error('Failed to load agent profile:', error);

      if (error.name === 'AbortError') {
        set({ loadError: 'CONNECTION_TIMEOUT' });
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        // Network error — backend is not running. Show error.
        set({ loadError: 'BACKEND_OFFLINE' });
      } else {
        // Unknown error — clear auth to be safe
        set({ isLoggedIn: false, loadError: 'AUTH_FAILED' });
      }
    }
  },

  // Clear load error
  clearLoadError: () => set({ loadError: null }),

  // Logout (server clears the cookie)
  logout: async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Даже если сервер недоступен, очищаем локальный стейт
    }
    set({
      isLoggedIn: false,
      loadError: null,
      agentInfo: {
        username: "UNKNOWN",
        alignment: "UNASSIGNED",
        level: 1,
        title: "RECRUIT",
        xp: 0,
        gameCredits: 500,
        premiumCredits: 0,
        nextLevelXp: 1000,
      },
      skillPoints: 3,
      unlockedSkills: [],
      xpLog: [],
    });
  },

  unlockSkill: async (skillId, cost = 1) => {
    if (get().skillPoints < cost || get().unlockedSkills.includes(skillId)) return;

    try {
      const response = await apiFetch('/api/skills/unlock', {
        method: 'POST',
        body: JSON.stringify({ skillId, cost }),
      });

      if (!response.ok) throw new Error('Failed to unlock skill');

      const data = await response.json();
      set({
        skillPoints: data.skillPoints,
        unlockedSkills: data.unlockedSkills.map(s => s.skill_id || s),
      });
    } catch (error) {
      console.error('Failed to unlock skill:', error);
    }
  },

  addSkillPoints: (amount) => set((state) => ({
    skillPoints: state.skillPoints + amount,
  })),

  addXp: async (amount, source = 'mission', label = 'Unknown') => {
    try {
      const response = await apiFetch('/api/xp/add', {
        method: 'POST',
        body: JSON.stringify({ amount, source, label }),
      });

      if (!response.ok) throw new Error('Failed to add XP');

      const data = await response.json();
      set((state) => ({
        agentInfo: {
          ...state.agentInfo,
          xp: data.xp,
          level: data.level,
          nextLevelXp: data.nextLevelXp,
        },
        skillPoints: data.skillPoints,
      }));

      // Reload full profile to get updated xpLog
      await get().loadAgentProfile();
    } catch (error) {
      console.error('Failed to add XP:', error);
      // Fallback to local state if API fails
      set((state) => {
        let newXp = state.agentInfo.xp + amount;
        let newLevel = state.agentInfo.level;
        let bonusSkillPoints = 0;
        let nextLevelXp = state.agentInfo.nextLevelXp;

        while (newXp >= nextLevelXp) {
          newLevel += 1;
          newXp -= nextLevelXp;
          bonusSkillPoints += 2;
          nextLevelXp = Math.floor(nextLevelXp * 1.15);
        }

        const newLogEntry = { source, label, xp: amount, timestamp: Date.now() };

        return {
          agentInfo: { ...state.agentInfo, xp: newXp, level: newLevel, nextLevelXp },
          skillPoints: state.skillPoints + bonusSkillPoints,
          xpLog: [newLogEntry, ...state.xpLog].slice(0, 50),
        };
      });
    }
  },

  addPremiumCredits: async (amount) => {
    try {
      const response = await apiFetch('/api/credits/add', {
        method: 'POST',
        body: JSON.stringify({ type: 'premium', amount }),
      });
      if (response.ok) {
        const data = await response.json();
        set((state) => ({
          agentInfo: { ...state.agentInfo, premiumCredits: data.premium_credits }
        }));
      } else {
        throw new Error('Failed backend save');
      }
    } catch {
      set((state) => ({
        agentInfo: { ...state.agentInfo, premiumCredits: state.agentInfo.premiumCredits + amount }
      }));
    }
  },

  addGameCredits: async (amount) => {
    try {
      const response = await apiFetch('/api/credits/add', {
        method: 'POST',
        body: JSON.stringify({ type: 'game', amount }),
      });
      if (response.ok) {
        const data = await response.json();
        set((state) => ({
          agentInfo: { ...state.agentInfo, gameCredits: data.game_credits }
        }));
      } else {
        throw new Error('Failed backend save');
      }
    } catch {
      set((state) => ({
        agentInfo: { ...state.agentInfo, gameCredits: state.agentInfo.gameCredits + amount }
      }));
    }
  },

  unlockMission: (missionId) => set((state) => ({
    missions: [...state.missions, missionId]
  })),

  setAlignment: (alignment) => set((state) => ({
    agentInfo: { ...state.agentInfo, alignment }
  })),

  register: (username, alignment) => set((state) => ({
    isLoggedIn: true,
    agentInfo: { ...state.agentInfo, username, alignment }
  })),

  setLanguage: (lang) => set({ language: lang }),
  
  toggleStreamerMode: () => set((state) => ({ streamerMode: !state.streamerMode })),

  // MMO / Real-time Global Chat Integration
  loadChatMessages: async (channel = 'global') => {
    try {
      const response = await apiFetch(`/api/chat/${channel}`);
      if (response.ok) {
        const messages = await response.json();
        set({ chatMessages: messages });
      }
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  },

  sendChatMessage: async (channel = 'global', message) => {
    try {
      const response = await apiFetch(`/api/chat/${channel}`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      if (response.ok) {
        await get().loadChatMessages(channel);
      }
    } catch (err) {
      console.error('Failed to send chat message:', err);
    }
  },

  // Leaderboard Integration
  loadLeaderboard: async () => {
    try {
      const response = await apiFetch('/api/pvp/leaderboard');
      if (response.ok) {
        const data = await response.json();
        set({ leaderboard: data });
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  },

  // PvP Duel Interaction
  pvpDuel: async (targetUsername, attackType, defenseType) => {
    try {
      const response = await apiFetch('/api/pvp/duel', {
        method: 'POST',
        body: JSON.stringify({ opponent: targetUsername, attack: attackType, defense: defenseType }),
      });
      if (response.ok) {
        const result = await response.json();
        
        // Sync ELO and wins/losses in state
        set((state) => ({
          pvpStats: {
            elo: result.agent.pvpElo,
            wins: result.agent.pvpWins,
            losses: result.agent.pvpLosses,
            streak: result.agent.pvpStreak,
          },
          agentInfo: {
            ...state.agentInfo,
            xp: result.agent.xp,
            level: result.agent.level,
            nextLevelXp: result.agent.nextLevelXp,
          }
        }));
        
        return result;
      }
      throw new Error('Failed to compute duel outcome');
    } catch (err) {
      console.error('Failed to execute pvp duel:', err);
      return null;
    }
  }
}));
