/**
 * CYBER_OPS://CORE — Supabase Database Client
 * Файл: backend/db.js
 *
 * Подключение к Supabase PostgreSQL через официальный JS SDK.
 * Использует Service Role Key для полного серверного доступа
 * (обход RLS-политик). Работает через HTTPS REST API,
 * не требует прямого TCP-подключения к PostgreSQL.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('  [DB] FATAL: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Тест соединения с Supabase при старте сервера.
 */
async function testConnection() {
  const { data, error } = await supabase
    .from('agents')
    .select('id')
    .limit(1);

  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
  console.log('  [DB] Connected to Supabase PostgreSQL successfully');
}

module.exports = { supabase, testConnection };
