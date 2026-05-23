/**
 * CYBER_OPS://CORE — API SERVER Mainframe v5.0.0
 * Файл: backend/server.js
 *
 * Backend на Express.js с Supabase PostgreSQL через JS SDK.
 * Helmet (заголовки безопасности), Rate Limiting, HTTP-only Cookie JWT.
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { supabase, testConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'cyber_ops_secret_key_2026';
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ─── Rate Limiting ───────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again in a minute.' },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts. Please wait.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// ─── Cookie Config ───────────────────────────────────────────────
const COOKIE_NAME = 'cyber_ops_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

// ─── Auth Middleware ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.agentId = decoded.id;
    req.agentUsername = decoded.username;
    next();
  } catch {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────
function getTitleForLevel(level) {
  if (level >= 20) return 'ELITE OPERATIVE';
  if (level >= 15) return 'SPECIALIST';
  if (level >= 10) return 'FIELD AGENT';
  if (level >= 5) return 'OPERATIVE';
  if (level >= 3) return 'INITIATE';
  return 'RECRUIT';
}

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
    pvpEnabled: agent.pvp_enabled,
    pvpElo: agent.pvp_elo,
    pvpWins: agent.pvp_wins,
    pvpLosses: agent.pvp_losses,
    pvpStreak: agent.pvp_streak,
  };
}

// ═══════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════

// System Status
app.get('/api/status', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;

    res.json({
      status: 'CYBER_OPS_CORE_ONLINE',
      version: '5.0.0',
      database: 'PostgreSQL (Supabase)',
      active_agents: count || 0,
      uptime: process.uptime(),
    });
  } catch (err) {
    console.error('Status error:', err.message);
    res.status(500).json({ error: 'Database query failed.' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, alignment } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  if (username.length < 3 || username.length > 16) return res.status(400).json({ error: 'Username must be 3-16 characters.' });

  try {
    // Check existing
    const { data: existing } = await supabase
      .from('agents')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (existing) return res.status(409).json({ error: 'Codename already taken.' });

    // Hash password and create agent
    const hash = bcrypt.hashSync(password, 10);
    const { data: newAgent, error: insertError } = await supabase
      .from('agents')
      .insert({
        username,
        password_hash: hash,
        alignment: alignment || 'UNASSIGNED',
      })
      .select()
      .single();
    if (insertError) throw insertError;

    // Starter skill
    await supabase
      .from('unlocked_skills')
      .insert({ agent_id: newAgent.id, skill_id: 'core-1' });

    // Generate JWT and set cookie
    const token = jwt.sign({ id: newAgent.id, username: newAgent.username }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(201).json({ token, agent: formatAgent(newAgent) });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

  try {
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;
    if (!agent) return res.status(404).json({ error: 'Agent not found.' });

    if (!bcrypt.compareSync(password, agent.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: agent.id, username: agent.username }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.json({ token, agent: formatAgent(agent) });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════
// PROTECTED ROUTES
// ═══════════════════════════════════════════════════════════════════

// Get Agent Profile
app.get('/api/agent/me', authMiddleware, async (req, res) => {
  try {
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', req.agentId)
      .single();
    if (error) throw error;
    if (!agent) return res.status(404).json({ error: 'Agent not found.' });

    const { data: skills } = await supabase
      .from('unlocked_skills')
      .select('skill_id')
      .eq('agent_id', req.agentId);

    const { data: xpLog } = await supabase
      .from('xp_log')
      .select('source, label, xp_amount, created_at')
      .eq('agent_id', req.agentId)
      .order('created_at', { ascending: false })
      .limit(20);

    res.json({
      ...formatAgent(agent),
      unlockedSkills: (skills || []).map(r => r.skill_id),
      xpLog: xpLog || [],
    });
  } catch (err) {
    console.error('Profile load error:', err.message);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
});

// Update Agent Profile
app.patch('/api/agent/me', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    if (username) {
      if (username.length < 3 || username.length > 16) return res.status(400).json({ error: 'Username must be 3-16 characters.' });
      const { data: existing } = await supabase
        .from('agents')
        .select('id')
        .eq('username', username)
        .neq('id', req.agentId)
        .maybeSingle();
      if (existing) return res.status(409).json({ error: 'Codename already taken.' });

      await supabase
        .from('agents')
        .update({ username })
        .eq('id', req.agentId);
    }
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', req.agentId)
      .single();
    res.json(formatAgent(agent));
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ─── Skills ──────────────────────────────────────────────────────
app.get('/api/skills', authMiddleware, async (req, res) => {
  try {
    const { data: skills } = await supabase
      .from('unlocked_skills')
      .select('skill_id, unlocked_at')
      .eq('agent_id', req.agentId);

    const { data: agent } = await supabase
      .from('agents')
      .select('skill_points')
      .eq('id', req.agentId)
      .single();

    res.json({ skillPoints: agent.skill_points, unlockedSkills: skills || [] });
  } catch (err) {
    console.error('Skills load error:', err.message);
    res.status(500).json({ error: 'Failed to load skills.' });
  }
});

app.post('/api/skills/unlock', authMiddleware, async (req, res) => {
  const { skillId, cost } = req.body;
  if (!skillId || !cost) return res.status(400).json({ error: 'skillId and cost required.' });

  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('skill_points')
      .eq('id', req.agentId)
      .single();
    if (agent.skill_points < cost) return res.status(400).json({ error: 'Not enough skill points.' });

    const { data: existingSkill } = await supabase
      .from('unlocked_skills')
      .select('id')
      .eq('agent_id', req.agentId)
      .eq('skill_id', skillId)
      .maybeSingle();
    if (existingSkill) return res.status(409).json({ error: 'Skill already unlocked.' });

    await supabase
      .from('unlocked_skills')
      .insert({ agent_id: req.agentId, skill_id: skillId });

    await supabase
      .from('agents')
      .update({ skill_points: agent.skill_points - cost })
      .eq('id', req.agentId);

    const { data: updated } = await supabase
      .from('agents')
      .select('skill_points')
      .eq('id', req.agentId)
      .single();

    const { data: skills } = await supabase
      .from('unlocked_skills')
      .select('skill_id, unlocked_at')
      .eq('agent_id', req.agentId);

    res.json({ success: true, skillPoints: updated.skill_points, unlockedSkills: skills || [] });
  } catch (err) {
    console.error('Skill unlock error:', err.message);
    res.status(500).json({ error: 'Failed to unlock skill.' });
  }
});

// ─── XP ──────────────────────────────────────────────────────────
app.post('/api/xp/add', authMiddleware, async (req, res) => {
  const { amount, source, label } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid XP amount.' });

  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', req.agentId)
      .single();

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

    await supabase
      .from('agents')
      .update({
        xp,
        level,
        next_level_xp: nextLevelXp,
        title,
        skill_points: agent.skill_points + bonusSP,
      })
      .eq('id', req.agentId);

    await supabase
      .from('xp_log')
      .insert({
        agent_id: req.agentId,
        source: source || 'mission',
        label: label || 'Unknown',
        xp_amount: amount,
      });

    const { data: updatedAgent } = await supabase
      .from('agents')
      .select('skill_points')
      .eq('id', req.agentId)
      .single();

    res.json({ xp, level, nextLevelXp, title, skillPoints: updatedAgent.skill_points });
  } catch (err) {
    console.error('XP add error:', err.message);
    res.status(500).json({ error: 'Failed to add XP.' });
  }
});

// ─── Credits ─────────────────────────────────────────────────────
app.post('/api/credits/add', authMiddleware, async (req, res) => {
  const { type, amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount.' });

  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('game_credits, premium_credits')
      .eq('id', req.agentId)
      .single();

    const update = type === 'premium'
      ? { premium_credits: agent.premium_credits + amount }
      : { game_credits: agent.game_credits + amount };

    await supabase
      .from('agents')
      .update(update)
      .eq('id', req.agentId);

    const { data: updated } = await supabase
      .from('agents')
      .select('game_credits, premium_credits')
      .eq('id', req.agentId)
      .single();

    res.json(updated);
  } catch (err) {
    console.error('Credits add error:', err.message);
    res.status(500).json({ error: 'Failed to add credits.' });
  }
});

// ─── PvP ─────────────────────────────────────────────────────────
app.post('/api/pvp/toggle', authMiddleware, async (req, res) => {
  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('pvp_enabled')
      .eq('id', req.agentId)
      .single();

    await supabase
      .from('agents')
      .update({ pvp_enabled: !agent.pvp_enabled })
      .eq('id', req.agentId);

    res.json({ pvpEnabled: !agent.pvp_enabled });
  } catch (err) {
    console.error('PvP toggle error:', err.message);
    res.status(500).json({ error: 'Failed to toggle PvP.' });
  }
});

app.get('/api/pvp/stats', authMiddleware, async (req, res) => {
  try {
    const { data: agent } = await supabase
      .from('agents')
      .select('pvp_elo, pvp_wins, pvp_losses, pvp_streak, pvp_enabled')
      .eq('id', req.agentId)
      .single();

    res.json({
      elo: agent.pvp_elo,
      wins: agent.pvp_wins,
      losses: agent.pvp_losses,
      streak: agent.pvp_streak,
      enabled: agent.pvp_enabled,
    });
  } catch (err) {
    console.error('PvP stats error:', err.message);
    res.status(500).json({ error: 'Failed to load PvP stats.' });
  }
});

app.get('/api/pvp/leaderboard', async (req, res) => {
  try {
    const { data } = await supabase
      .from('agents')
      .select('username, pvp_elo, pvp_wins, pvp_losses')
      .or('pvp_wins.gt.0,pvp_losses.gt.0')
      .order('pvp_elo', { ascending: false })
      .limit(20);

    res.json(data || []);
  } catch (err) {
    console.error('Leaderboard error:', err.message);
    res.status(500).json({ error: 'Failed to load leaderboard.' });
  }
});

// PvP Duel combat calculation
app.post('/api/pvp/duel', authMiddleware, async (req, res) => {
  const { opponent, attack, defense } = req.body;
  if (!opponent || !attack || !defense) {
    return res.status(400).json({ error: 'Opponent, attack, and defense selections required.' });
  }

  try {
    // 1. Fetch current agent
    const { data: agent, error: agentErr } = await supabase
      .from('agents')
      .select('*')
      .eq('id', req.agentId)
      .single();
    if (agentErr || !agent) return res.status(404).json({ error: 'Agent profile not found.' });

    // 2. Fetch opponent agent
    const { data: oppAgent, error: oppErr } = await supabase
      .from('agents')
      .select('*')
      .eq('username', opponent)
      .maybeSingle();

    // 3. Fallback/Simulation if not found
    let targetName = opponent;
    let targetElo = oppAgent ? oppAgent.pvp_elo : 1200;
    
    // Choose simulated opponent choices
    const optionsAttack = ['SQLi', 'DDoS', 'Overflow'];
    const optionsDefense = ['WAF', 'IPS', 'IDS'];
    const oppAttack = optionsAttack[Math.floor(Math.random() * 3)];
    const oppDefense = optionsDefense[Math.floor(Math.random() * 3)];

    // Rock-Paper-Scissors matrix
    // Attack beats defense unless defense blocks it:
    // SQLi is blocked by WAF
    // DDoS is blocked by IPS
    // Overflow is blocked by IDS
    let playerBreached = true;
    if (attack === 'SQLi' && oppDefense === 'WAF') playerBreached = false;
    if (attack === 'DDoS' && oppDefense === 'IPS') playerBreached = false;
    if (attack === 'Overflow' && oppDefense === 'IDS') playerBreached = false;

    let oppBreached = true;
    if (oppAttack === 'SQLi' && defense === 'WAF') oppBreached = false;
    if (oppAttack === 'DDoS' && defense === 'IPS') oppBreached = false;
    if (oppAttack === 'Overflow' && defense === 'IDS') oppBreached = false;

    // Determine outcome
    let result = 'DRAW';
    let eloChange = 0;
    let xpGain = 20; // XP base
    let creditsGain = 50;

    if (playerBreached && !oppBreached) {
      result = 'WIN';
      eloChange = Math.max(15, Math.floor(25 + (targetElo - agent.pvp_elo) * 0.1));
      xpGain = 80;
      creditsGain = 150;
    } else if (!playerBreached && oppBreached) {
      result = 'LOSS';
      eloChange = -Math.max(10, Math.floor(18 - (targetElo - agent.pvp_elo) * 0.05));
      xpGain = 15;
      creditsGain = 20;
    } else {
      // Both breached or both defended
      result = Math.random() > 0.5 ? 'WIN' : 'LOSS';
      if (result === 'WIN') {
        eloChange = 15;
        xpGain = 50;
        creditsGain = 100;
      } else {
        eloChange = -10;
        xpGain = 15;
        creditsGain = 20;
      }
    }

    // 4. Update player ELO and stats in DB
    const newElo = Math.max(100, agent.pvp_elo + eloChange);
    const newWins = result === 'WIN' ? agent.pvp_wins + 1 : agent.pvp_wins;
    const newLosses = result === 'LOSS' ? agent.pvp_losses + 1 : agent.pvp_losses;
    const newStreak = result === 'WIN' ? agent.pvp_streak + 1 : 0;

    // Handle XP gains & level ups
    let newXp = agent.xp + xpGain;
    let newLevel = agent.level;
    let nextLevelXp = agent.next_level_xp;
    let bonusSP = 0;

    while (newXp >= nextLevelXp) {
      newLevel += 1;
      newXp -= nextLevelXp;
      bonusSP += 2;
      nextLevelXp = Math.floor(nextLevelXp * 1.15);
    }
    const newTitle = getTitleForLevel(newLevel);

    // Save to agents table
    await supabase
      .from('agents')
      .update({
        pvp_elo: newElo,
        pvp_wins: newWins,
        pvp_losses: newLosses,
        pvp_streak: newStreak,
        xp: newXp,
        level: newLevel,
        next_level_xp: nextLevelXp,
        title: newTitle,
        skill_points: agent.skill_points + bonusSP,
        game_credits: agent.game_credits + creditsGain,
      })
      .eq('id', req.agentId);

    // Save XP activity log
    await supabase
      .from('xp_log')
      .insert({
        agent_id: req.agentId,
        source: 'pvp',
        label: `PvP Duel vs ${targetName} (${result})`,
        xp_amount: xpGain,
      });

    // Update opponent stats if it's a real player in DB
    if (oppAgent) {
      const oppNewElo = Math.max(100, oppAgent.pvp_elo - eloChange);
      const oppNewWins = result === 'LOSS' ? oppAgent.pvp_wins + 1 : oppAgent.pvp_wins;
      const oppNewLosses = result === 'WIN' ? oppAgent.pvp_losses + 1 : oppAgent.pvp_losses;
      const oppNewStreak = result === 'LOSS' ? oppAgent.pvp_streak + 1 : 0;
      await supabase
        .from('agents')
        .update({
          pvp_elo: oppNewElo,
          pvp_wins: oppNewWins,
          pvp_losses: oppNewLosses,
          pvp_streak: oppNewStreak,
        })
        .eq('id', oppAgent.id);
    }

    // Get updated agent info
    const { data: updatedAgent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', req.agentId)
      .single();

    res.json({
      success: true,
      result,
      eloChange,
      xpGain,
      creditsGain,
      oppChoice: { attack: oppAttack, defense: oppDefense },
      agent: formatAgent(updatedAgent),
    });

  } catch (err) {
    console.error('PvP duel error:', err.message);
    res.status(500).json({ error: 'Failed to process PvP duel.' });
  }
});

// ─── Inventory ───────────────────────────────────────────────────
app.get('/api/inventory', authMiddleware, async (req, res) => {
  try {
    const { data } = await supabase
      .from('inventory')
      .select('*')
      .eq('agent_id', req.agentId);
    res.json(data || []);
  } catch (err) {
    console.error('Inventory load error:', err.message);
    res.status(500).json({ error: 'Failed to load inventory.' });
  }
});

app.post('/api/inventory/equip', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  try {
    const { data: item } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', itemId)
      .eq('agent_id', req.agentId)
      .maybeSingle();
    if (!item) return res.status(404).json({ error: 'Item not found.' });

    // Unequip other items of the same type
    await supabase
      .from('inventory')
      .update({ equipped: false })
      .eq('agent_id', req.agentId)
      .eq('item_type', item.item_type);

    await supabase
      .from('inventory')
      .update({ equipped: true })
      .eq('id', itemId);

    res.json({ success: true });
  } catch (err) {
    console.error('Equip error:', err.message);
    res.status(500).json({ error: 'Failed to equip item.' });
  }
});

// ─── Chat ────────────────────────────────────────────────────────
app.get('/api/chat/:channel', authMiddleware, async (req, res) => {
  try {
    const { data } = await supabase
      .from('chat_messages')
      .select('message, created_at, agents!inner(username)')
      .eq('channel', req.params.channel)
      .order('created_at', { ascending: false })
      .limit(50);

    // Format response: flatten agents join
    const messages = (data || []).reverse().map(m => ({
      message: m.message,
      created_at: m.created_at,
      username: m.agents?.username || 'UNKNOWN',
    }));

    res.json(messages);
  } catch (err) {
    console.error('Chat load error:', err.message);
    res.status(500).json({ error: 'Failed to load chat.' });
  }
});

app.post('/api/chat/:channel', authMiddleware, async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message required.' });

  try {
    await supabase
      .from('chat_messages')
      .insert({
        agent_id: req.agentId,
        channel: req.params.channel,
        message: message.trim(),
      });
    res.json({ success: true });
  } catch (err) {
    console.error('Chat send error:', err.message);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// ─── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start Server ────────────────────────────────────────────────
async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`\n  ╔══════════════════════════════════════════╗`);
      console.log(`  ║  CYBER_OPS BACKEND v5.0.0                ║`);
      console.log(`  ║  Database: Supabase PostgreSQL (REST)     ║`);
      console.log(`  ║  Port: ${PORT}                             ║`);
      console.log(`  ║  Security: Helmet + Rate Limiter         ║`);
      console.log(`  ║  Auth: HTTP-only Cookie JWT              ║`);
      console.log(`  ║  Status: ONLINE                          ║`);
      console.log(`  ╚══════════════════════════════════════════╝\n`);
    });
  } catch (err) {
    console.error('\n  ╔══════════════════════════════════════════╗');
    console.error('  ║  FATAL: Cannot connect to database       ║');
    console.error('  ╚══════════════════════════════════════════╝');
    console.error('  Error:', err.message);
    console.error('  Check SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.\n');
    process.exit(1);
  }
}

start();
