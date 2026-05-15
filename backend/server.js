const express = require('express');
const cors = require('cors');
const sqlite3 = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'cyber_ops_secret_key_2026';

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Database Setup ──────────────────────────────────────────────
const db = new sqlite3('cyber_ops.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    alignment TEXT DEFAULT 'UNASSIGNED',
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    next_level_xp INTEGER DEFAULT 1000,
    title TEXT DEFAULT 'RECRUIT',
    game_credits INTEGER DEFAULT 500,
    premium_credits INTEGER DEFAULT 0,
    skill_points INTEGER DEFAULT 3,
    pvp_enabled INTEGER DEFAULT 0,
    pvp_elo INTEGER DEFAULT 1000,
    pvp_wins INTEGER DEFAULT 0,
    pvp_losses INTEGER DEFAULT 0,
    pvp_streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS unlocked_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    skill_id TEXT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    UNIQUE(agent_id, skill_id)
  );

  CREATE TABLE IF NOT EXISTS xp_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    source TEXT NOT NULL,
    label TEXT NOT NULL,
    xp_amount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    item_type TEXT NOT NULL,
    rarity TEXT DEFAULT 'common',
    buff TEXT,
    equipped INTEGER DEFAULT 0,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    channel TEXT DEFAULT 'global',
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );
`);

// ─── Auth Middleware ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.agentId = decoded.id;
    req.agentUsername = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ─── Helper: Level Titles ────────────────────────────────────────
function getTitleForLevel(level) {
  if (level >= 20) return 'ELITE OPERATIVE';
  if (level >= 15) return 'SPECIALIST';
  if (level >= 10) return 'FIELD AGENT';
  if (level >= 5) return 'OPERATIVE';
  if (level >= 3) return 'INITIATE';
  return 'RECRUIT';
}

// ═══════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════

// System Status
app.get('/api/status', (req, res) => {
  const agentCount = db.prepare('SELECT COUNT(*) as count FROM agents').get().count;
  res.json({
    status: 'CYBER_OPS_CORE_ONLINE',
    version: '4.2.1',
    active_agents: agentCount,
    uptime: process.uptime(),
  });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, password, alignment } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  if (username.length < 3 || username.length > 16) return res.status(400).json({ error: 'Username must be 3-16 characters.' });

  const existing = db.prepare('SELECT id FROM agents WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'Codename already taken.' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO agents (username, password_hash, alignment) VALUES (?, ?, ?)'
  ).run(username, hash, alignment || 'UNASSIGNED');

  // Give starter skills
  const starterSkills = ['core-1'];
  const insertSkill = db.prepare('INSERT INTO unlocked_skills (agent_id, skill_id) VALUES (?, ?)');
  starterSkills.forEach(s => insertSkill.run(result.lastInsertRowid, s));

  const token = jwt.sign({ id: result.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, agent: { id: result.lastInsertRowid, username, alignment: alignment || 'UNASSIGNED' } });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

  const agent = db.prepare('SELECT * FROM agents WHERE username = ?').get(username);
  if (!agent) return res.status(404).json({ error: 'Agent not found.' });

  if (!bcrypt.compareSync(password, agent.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: agent.id, username: agent.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, agent: formatAgent(agent) });
});

// ═══════════════════════════════════════════════════════════════════
// PROTECTED ROUTES (require auth)
// ═══════════════════════════════════════════════════════════════════

// Get Agent Profile
app.get('/api/agent/me', authMiddleware, (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.agentId);
  if (!agent) return res.status(404).json({ error: 'Agent not found.' });

  const skills = db.prepare('SELECT skill_id FROM unlocked_skills WHERE agent_id = ?').all(req.agentId).map(r => r.skill_id);
  const recentXp = db.prepare('SELECT source, label, xp_amount, created_at FROM xp_log WHERE agent_id = ? ORDER BY created_at DESC LIMIT 20').all(req.agentId);

  res.json({ ...formatAgent(agent), unlockedSkills: skills, xpLog: recentXp });
});

// Update Agent Profile
app.patch('/api/agent/me', authMiddleware, (req, res) => {
  const { username } = req.body;
  if (username) {
    if (username.length < 3 || username.length > 16) return res.status(400).json({ error: 'Username must be 3-16 characters.' });
    const existing = db.prepare('SELECT id FROM agents WHERE username = ? AND id != ?').get(username, req.agentId);
    if (existing) return res.status(409).json({ error: 'Codename already taken.' });
    db.prepare('UPDATE agents SET username = ? WHERE id = ?').run(username, req.agentId);
  }
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.agentId);
  res.json(formatAgent(agent));
});

// ─── Skills ──────────────────────────────────────────────────────
app.get('/api/skills', authMiddleware, (req, res) => {
  const skills = db.prepare('SELECT skill_id, unlocked_at FROM unlocked_skills WHERE agent_id = ?').all(req.agentId);
  const agent = db.prepare('SELECT skill_points FROM agents WHERE id = ?').get(req.agentId);
  res.json({ skillPoints: agent.skill_points, unlockedSkills: skills });
});

app.post('/api/skills/unlock', authMiddleware, (req, res) => {
  const { skillId, cost } = req.body;
  if (!skillId || !cost) return res.status(400).json({ error: 'skillId and cost required.' });

  const agent = db.prepare('SELECT skill_points FROM agents WHERE id = ?').get(req.agentId);
  if (agent.skill_points < cost) return res.status(400).json({ error: 'Not enough skill points.' });

  const existing = db.prepare('SELECT id FROM unlocked_skills WHERE agent_id = ? AND skill_id = ?').get(req.agentId, skillId);
  if (existing) return res.status(409).json({ error: 'Skill already unlocked.' });

  db.prepare('INSERT INTO unlocked_skills (agent_id, skill_id) VALUES (?, ?)').run(req.agentId, skillId);
  db.prepare('UPDATE agents SET skill_points = skill_points - ? WHERE id = ?').run(cost, req.agentId);

  const updated = db.prepare('SELECT skill_points FROM agents WHERE id = ?').get(req.agentId);
  res.json({ success: true, skillPoints: updated.skill_points });
});

// ─── XP ──────────────────────────────────────────────────────────
app.post('/api/xp/add', authMiddleware, (req, res) => {
  const { amount, source, label } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid XP amount.' });

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.agentId);
  let xp = agent.xp + amount;
  let level = agent.level;
  let nextLevelXp = agent.next_level_xp;
  let bonusSP = 0;

  while (xp >= nextLevelXp) {
    level += 1;
    xp -= nextLevelXp;
    bonusSP += 2;
    nextLevelXp = Math.floor(nextLevelXp * 1.15);
  }

  const title = getTitleForLevel(level);
  db.prepare('UPDATE agents SET xp = ?, level = ?, next_level_xp = ?, title = ?, skill_points = skill_points + ? WHERE id = ?')
    .run(xp, level, nextLevelXp, title, bonusSP, req.agentId);

  db.prepare('INSERT INTO xp_log (agent_id, source, label, xp_amount) VALUES (?, ?, ?, ?)')
    .run(req.agentId, source || 'mission', label || 'Unknown', amount);

  res.json({ xp, level, nextLevelXp, title, bonusSkillPoints: bonusSP });
});

// ─── Credits ─────────────────────────────────────────────────────
app.post('/api/credits/add', authMiddleware, (req, res) => {
  const { type, amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount.' });
  const col = type === 'premium' ? 'premium_credits' : 'game_credits';
  db.prepare(`UPDATE agents SET ${col} = ${col} + ? WHERE id = ?`).run(amount, req.agentId);
  const agent = db.prepare('SELECT game_credits, premium_credits FROM agents WHERE id = ?').get(req.agentId);
  res.json(agent);
});

// ─── PvP ─────────────────────────────────────────────────────────
app.post('/api/pvp/toggle', authMiddleware, (req, res) => {
  db.prepare('UPDATE agents SET pvp_enabled = NOT pvp_enabled WHERE id = ?').run(req.agentId);
  const agent = db.prepare('SELECT pvp_enabled FROM agents WHERE id = ?').get(req.agentId);
  res.json({ pvpEnabled: !!agent.pvp_enabled });
});

app.get('/api/pvp/stats', authMiddleware, (req, res) => {
  const agent = db.prepare('SELECT pvp_elo, pvp_wins, pvp_losses, pvp_streak, pvp_enabled FROM agents WHERE id = ?').get(req.agentId);
  res.json({
    elo: agent.pvp_elo,
    wins: agent.pvp_wins,
    losses: agent.pvp_losses,
    streak: agent.pvp_streak,
    enabled: !!agent.pvp_enabled,
  });
});

app.get('/api/pvp/leaderboard', (req, res) => {
  const top = db.prepare('SELECT username, pvp_elo, pvp_wins, pvp_losses FROM agents WHERE pvp_wins + pvp_losses > 0 ORDER BY pvp_elo DESC LIMIT 20').all();
  res.json(top);
});

// ─── Inventory ───────────────────────────────────────────────────
app.get('/api/inventory', authMiddleware, (req, res) => {
  const items = db.prepare('SELECT * FROM inventory WHERE agent_id = ?').all(req.agentId);
  res.json(items);
});

app.post('/api/inventory/equip', authMiddleware, (req, res) => {
  const { itemId } = req.body;
  const item = db.prepare('SELECT * FROM inventory WHERE id = ? AND agent_id = ?').get(itemId, req.agentId);
  if (!item) return res.status(404).json({ error: 'Item not found.' });

  // Unequip other items of the same type
  db.prepare('UPDATE inventory SET equipped = 0 WHERE agent_id = ? AND item_type = ?').run(req.agentId, item.item_type);
  db.prepare('UPDATE inventory SET equipped = 1 WHERE id = ?').run(itemId);
  res.json({ success: true });
});

// ─── Chat ────────────────────────────────────────────────────────
app.get('/api/chat/:channel', authMiddleware, (req, res) => {
  const messages = db.prepare(`
    SELECT cm.message, cm.created_at, a.username
    FROM chat_messages cm JOIN agents a ON cm.agent_id = a.id
    WHERE cm.channel = ? ORDER BY cm.created_at DESC LIMIT 50
  `).all(req.params.channel);
  res.json(messages.reverse());
});

app.post('/api/chat/:channel', authMiddleware, (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message required.' });
  db.prepare('INSERT INTO chat_messages (agent_id, channel, message) VALUES (?, ?, ?)').run(req.agentId, req.params.channel, message.trim());
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════
// Helper: Format agent for API response (strip password)
// ═══════════════════════════════════════════════════════════════════
function formatAgent(agent) {
  return {
    id: agent.id,
    username: agent.username,
    alignment: agent.alignment,
    level: agent.level,
    xp: agent.xp,
    nextLevelXp: agent.next_level_xp,
    title: agent.title,
    gameCredits: agent.game_credits,
    premiumCredits: agent.premium_credits,
    skillPoints: agent.skill_points,
    pvpEnabled: !!agent.pvp_enabled,
    pvpElo: agent.pvp_elo,
    pvpWins: agent.pvp_wins,
    pvpLosses: agent.pvp_losses,
    pvpStreak: agent.pvp_streak,
  };
}

// ─── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════════╗`);
  console.log(`  ║  CYBER_OPS BACKEND v4.2.1                ║`);
  console.log(`  ║  Port: ${PORT}                             ║`);
  console.log(`  ║  Status: ONLINE                          ║`);
  console.log(`  ╚══════════════════════════════════════════╝\n`);
});
