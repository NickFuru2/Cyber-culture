import { create } from 'zustand';

export const useStore = create((set, get) => ({
  isLoggedIn: false,
  language: 'EN',
  streamerMode: false,
  agentInfo: {
    username: "UNKNOWN",
    alignment: "UNASSIGNED",
    level: 14,
    title: "SPECIALIST",
    xp: 8450,
    gameCredits: 1337,
    premiumCredits: 0,
    nextLevelXp: 10000,
  },
  missions: [],
  inventory: [],
  skillPoints: 8,
  unlockedSkills: ['core-1', 'core-2', 'core-3', 'off-1', 'def-1'],

  // PvP State
  pvpEnabled: false,
  pvpStats: { elo: 2340, wins: 47, losses: 21, streak: 3 },
  togglePvp: () => set((state) => ({ pvpEnabled: !state.pvpEnabled })),

  // XP Activity Log — tracks recent XP gains from various sources
  xpLog: [
    { source: 'mission', label: 'Decrypt Payload', xp: 50, timestamp: Date.now() - 120000 },
    { source: 'textbook', label: 'Linux Basics for Hackers (Ch.6)', xp: 30, timestamp: Date.now() - 300000 },
    { source: 'raid', label: 'Zeus Mainframe Raid', xp: 200, timestamp: Date.now() - 600000 },
    { source: 'pvp', label: 'PvP Intrusion Defended', xp: 75, timestamp: Date.now() - 900000 },
  ],

  unlockSkill: (skillId, cost = 1) => set((state) => {
    if (state.skillPoints < cost || state.unlockedSkills.includes(skillId)) return state;
    return { skillPoints: state.skillPoints - cost, unlockedSkills: [...state.unlockedSkills, skillId] };
  }),

  addSkillPoints: (amount) => set((state) => ({
    skillPoints: state.skillPoints + amount,
  })),

  addXp: (amount, source = 'mission', label = 'Unknown') => set((state) => {
    let newXp = state.agentInfo.xp + amount;
    let newLevel = state.agentInfo.level;
    let bonusSkillPoints = 0;
    let nextLevelXp = state.agentInfo.nextLevelXp;

    // Level up loop (handles multi-level ups from large XP gains)
    while (newXp >= nextLevelXp) {
      newLevel += 1;
      newXp -= nextLevelXp;
      bonusSkillPoints += 2; // Grant 2 skill points per level up
      nextLevelXp = Math.floor(nextLevelXp * 1.15); // Each level requires 15% more XP
    }

    const newLogEntry = { source, label, xp: amount, timestamp: Date.now() };

    return {
      agentInfo: { ...state.agentInfo, xp: newXp, level: newLevel, nextLevelXp },
      skillPoints: state.skillPoints + bonusSkillPoints,
      xpLog: [newLogEntry, ...state.xpLog].slice(0, 50), // Keep last 50 entries
    };
  }),

  addPremiumCredits: (amount) => set((state) => ({
    agentInfo: { ...state.agentInfo, premiumCredits: state.agentInfo.premiumCredits + amount }
  })),
  addGameCredits: (amount) => set((state) => ({
    agentInfo: { ...state.agentInfo, gameCredits: state.agentInfo.gameCredits + amount }
  })),
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
}));
