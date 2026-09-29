import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
const isTurso = Boolean(tursoUrl && tursoAuthToken);

function normalizeArgs(params) {
  if (params.length === 1 && Array.isArray(params[0])) {
    return params[0].map(v => (v === undefined ? null : v));
  }
  if (params.length === 1 && params[0] && typeof params[0] === 'object' && !Array.isArray(params[0])) {
    const clean = {};
    for (const [k, v] of Object.entries(params[0])) {
      clean[k] = v === undefined ? null : v;
    }
    return clean;
  }
  return params.map(v => (v === undefined ? null : v));
}

let tursoClient = null;
let localDb = null;

if (isTurso) {
  console.log('[DB] Connecting to Turso Cloud Database:', tursoUrl);
  tursoClient = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });
} else {
  const isVercel = Boolean(process.env.VERCEL);
  let dbPath;

  if (isVercel) {
    dbPath = '/tmp/mariya_foundation.db';
    const sourceDbPath = path.resolve(__dirname, '../../data/mariya_foundation.db');
    if (!fs.existsSync(dbPath) && fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, dbPath);
        const walPath = sourceDbPath + '-wal';
        const shmPath = sourceDbPath + '-shm';
        if (fs.existsSync(walPath)) try { fs.copyFileSync(walPath, dbPath + '-wal'); } catch (_) {}
        if (fs.existsSync(shmPath)) try { fs.copyFileSync(shmPath, dbPath + '-shm'); } catch (_) {}
      } catch (err) {
        console.warn('[DB] Could not copy bundled DB to /tmp:', err.message);
      }
    }
  } else {
    dbPath = path.resolve(__dirname, '../../data/mariya_foundation.db');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  localDb = new Database(dbPath);
  try {
    if (isVercel) {
      localDb.pragma('journal_mode = DELETE');
    } else {
      localDb.pragma('journal_mode = WAL');
      localDb.pragma('wal_autocheckpoint = 20');
    }
  } catch (_) {}
  localDb.pragma('foreign_keys = ON');

  const handleShutdown = () => {
    try {
      if (localDb && localDb.open) {
        localDb.pragma('wal_checkpoint(TRUNCATE)');
        localDb.close();
      }
    } catch (_) {}
  };

  process.on('exit', handleShutdown);
  process.on('SIGINT', () => { handleShutdown(); process.exit(0); });
  process.on('SIGTERM', () => { handleShutdown(); process.exit(0); });
}

export const db = {
  isTurso,
  prepare(sql) {
    if (isTurso) {
      return {
        async all(...params) {
          const args = normalizeArgs(params);
          const result = await tursoClient.execute({ sql, args });
          return result.rows;
        },
        async get(...params) {
          const args = normalizeArgs(params);
          const result = await tursoClient.execute({ sql, args });
          return result.rows[0] || undefined;
        },
        async run(...params) {
          const args = normalizeArgs(params);
          const result = await tursoClient.execute({ sql, args });
          return {
            changes: result.rowsAffected,
            lastInsertRowid: result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : 0
          };
        }
      };
    } else {
      const stmt = localDb.prepare(sql);
      return {
        async all(...params) {
          const args = normalizeArgs(params);
          return stmt.all(...args);
        },
        async get(...params) {
          const args = normalizeArgs(params);
          return stmt.get(...args);
        },
        async run(...params) {
          const args = normalizeArgs(params);
          return stmt.run(...args);
        }
      };
    }
  },
  async exec(sql) {
    if (isTurso) {
      return await tursoClient.executeMultiple(sql);
    } else {
      return localDb.exec(sql);
    }
  },
  transaction(fn) {
    if (isTurso) {
      return async (...args) => {
        return await fn(...args);
      };
    } else {
      const tx = localDb.transaction(fn);
      return async (...args) => {
        return tx(...args);
      };
    }
  }
};

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS program_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    image_url TEXT,
    objectives TEXT,
    target_beneficiaries TEXT,
    activities TEXT,
    status TEXT DEFAULT 'active',
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES program_categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS impact_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    prefix TEXT DEFAULT '',
    suffix TEXT DEFAULT '+',
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS impact_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    beneficiary_name TEXT NOT NULL,
    category TEXT NOT NULL,
    before_situation TEXT,
    after_situation TEXT,
    quote TEXT,
    story_content TEXT NOT NULL,
    image_url TEXT,
    location TEXT,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    caption TEXT,
    image_url TEXT NOT NULL,
    location TEXT,
    event_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hero_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT DEFAULT 'Mariya Foundation Team',
    featured_image TEXT,
    is_published INTEGER DEFAULT 1,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    location TEXT,
    content TEXT NOT NULL,
    avatar_url TEXT,
    rating INTEGER DEFAULT 5,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS volunteer_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    skills TEXT NOT NULL,
    availability TEXT NOT NULL,
    area_of_interest TEXT NOT NULL,
    motivation TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS program_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    program_id INTEGER,
    applicant_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    address TEXT NOT NULL,
    occupation TEXT,
    statement_of_need TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS donation_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_name TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    routing_or_iban TEXT,
    currency TEXT DEFAULT 'NGN',
    instructions TEXT,
    is_primary INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donation_pledges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    purpose_category TEXT NOT NULL,
    amount REAL,
    currency TEXT DEFAULT 'NGN',
    payment_method TEXT DEFAULT 'Bank Transfer',
    reference_no TEXT,
    status TEXT DEFAULT 'pledged',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    group_name TEXT DEFAULT 'general'
  );
`;

export async function initDatabase() {
  await db.exec(SCHEMA_SQL);

  // Ensure default admin exists if empty
  const adminCheck = await db.prepare('SELECT count(*) as count FROM admins').get();
  if (adminCheck && adminCheck.count === 0) {
    const hashedPassword = bcrypt.hashSync('AdminPassword123!', 10);
    await db.prepare(`
      INSERT INTO admins (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('Mariya Foundation Administrator', 'admin@mariyafoundation.org', hashedPassword, 'superadmin');
  }
}
