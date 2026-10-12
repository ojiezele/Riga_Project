import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';
import fs from 'fs';

const { Pool } = pg;

declare global {
  var _postgresPool: InstanceType<typeof Pool> | any;
}

export const isDbConfigured = Boolean(
  process.env.DATABASE_URL ||
  (process.env.SQL_HOST &&
   process.env.SQL_USER &&
   process.env.SQL_HOST !== '/cloudsql/project:region:instance' &&
   !process.env.SQL_HOST.includes('project:region:instance') &&
   (!process.env.SQL_HOST.startsWith('/') || fs.existsSync(process.env.SQL_HOST)))
);

export const createPool = () => {
  if (!isDbConfigured) {
    // Database not configured - return in-memory mock pool
    return {
      query: async () => ({ rows: [] }),
      connect: async () => ({
        query: async () => ({ rows: [] }),
        release: () => {}
      }),
      on: () => {},
      end: async () => {}
    };
  }

  if (!global._postgresPool) {
    try {
      const connectionString = process.env.DATABASE_URL;
      global._postgresPool = new Pool(
        connectionString
          ? {
              connectionString,
              ssl: { rejectUnauthorized: false },
              max: 10,
              connectionTimeoutMillis: 5000,
            }
          : {
              host: process.env.SQL_HOST,
              user: process.env.SQL_USER,
              password: process.env.SQL_PASSWORD,
              database: process.env.SQL_DB_NAME,
              port: Number(process.env.SQL_PORT || 5432),
              ssl: { rejectUnauthorized: false },
              max: 10,
              connectionTimeoutMillis: 5000,
            }
      );

      global._postgresPool.on('error', (err: any) => {
        console.warn('Unexpected error on idle SQL pool client:', err.message);
      });

      // Automatically ensure Better Auth & Riga SaaS tables exist in Neon PostgreSQL
      global._postgresPool.query(`
        -- Better Auth Core: "user"
        CREATE TABLE IF NOT EXISTS "user" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          image TEXT,
          role TEXT NOT NULL DEFAULT 'Owner',
          plan TEXT NOT NULL DEFAULT 'WordPress Pro SaaS',
          banned BOOLEAN DEFAULT FALSE,
          ban_reason TEXT,
          ban_expires TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        ALTER TABLE "user" ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
        ALTER TABLE "user" ADD COLUMN IF NOT EXISTS ban_reason TEXT;
        ALTER TABLE "user" ADD COLUMN IF NOT EXISTS ban_expires TIMESTAMP;

        -- Better Auth Core: "session"
        CREATE TABLE IF NOT EXISTS "session" (
          id TEXT PRIMARY KEY,
          expires_at TIMESTAMP NOT NULL,
          token TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          ip_address TEXT,
          user_agent TEXT,
          user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
          active_organization_id TEXT,
          impersonated_by TEXT
        );

        ALTER TABLE "session" ADD COLUMN IF NOT EXISTS impersonated_by TEXT;

        -- Better Auth Core: "account" (hashed passwords & auth credentials)
        CREATE TABLE IF NOT EXISTS "account" (
          id TEXT PRIMARY KEY,
          account_id TEXT NOT NULL,
          provider_id TEXT NOT NULL,
          user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
          access_token TEXT,
          refresh_token TEXT,
          id_token TEXT,
          access_token_expires_at TIMESTAMP,
          refresh_token_expires_at TIMESTAMP,
          scope TEXT,
          password TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        -- Better Auth Core: "verification"
        CREATE TABLE IF NOT EXISTS "verification" (
          id TEXT PRIMARY KEY,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Better Auth Plugin: "organization" (Workspaces & Tenants)
        CREATE TABLE IF NOT EXISTS "organization" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE,
          logo TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          metadata TEXT
        );

        -- Better Auth Plugin: "member" (RBAC: Owner, Admin, Editor, Member, Viewer)
        CREATE TABLE IF NOT EXISTS "member" (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL REFERENCES "organization"(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
          role TEXT NOT NULL DEFAULT 'member',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        -- Better Auth Plugin: "invitation"
        CREATE TABLE IF NOT EXISTS "invitation" (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL REFERENCES "organization"(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          role TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          expires_at TIMESTAMP NOT NULL,
          inviter_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        -- Enterprise Billing & Subscriptions
        CREATE TABLE IF NOT EXISTS "subscriptions" (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          organization_id TEXT,
          plan TEXT NOT NULL DEFAULT 'WordPress Pro SaaS',
          status TEXT NOT NULL DEFAULT 'active',
          billing_cycle TEXT NOT NULL DEFAULT 'monthly',
          price TEXT NOT NULL DEFAULT '$49',
          seats INTEGER NOT NULL DEFAULT 5,
          storage_gb INTEGER NOT NULL DEFAULT 50,
          sites_limit INTEGER NOT NULL DEFAULT 20,
          features TEXT DEFAULT '["Cloudflare R2 Object Storage", "Global Edge CDN", "Unlimited Funnels", "Custom Domains with SSL", "Team RBAC Workspace"]',
          current_period_end TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Backward-Compatible / Legacy Users Table
        CREATE TABLE IF NOT EXISTS "users" (
          id SERIAL PRIMARY KEY,
          uid TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL,
          name TEXT NOT NULL DEFAULT '',
          password TEXT DEFAULT '',
          role TEXT NOT NULL DEFAULT 'Owner',
          plan TEXT NOT NULL DEFAULT 'WordPress Pro SaaS',
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Hosted Websites & Funnels (Shopify / WordPress Grade with JSON AST + HTML)
        CREATE TABLE IF NOT EXISTS "sites" (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          organization_id TEXT,
          name TEXT NOT NULL,
          subdomain TEXT NOT NULL,
          theme TEXT NOT NULL DEFAULT 'standard/Y1_a_1_Column_Layout',
          html_content TEXT DEFAULT '',
          json_data TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'published',
          visitors TEXT NOT NULL DEFAULT '0',
          bundle_size TEXT DEFAULT '42 KB',
          version_hash TEXT,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Ensure optional columns exist in sites if created earlier
        ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS html_content TEXT DEFAULT '';
        ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS json_data TEXT DEFAULT '';
        ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS organization_id TEXT;
        ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS bundle_size TEXT DEFAULT '42 KB';
        ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS version_hash TEXT;
        ALTER TABLE "team" ADD COLUMN IF NOT EXISTS organization_id TEXT;
        ALTER TABLE "domains" ADD COLUMN IF NOT EXISTS organization_id TEXT;
        ALTER TABLE "media" ADD COLUMN IF NOT EXISTS organization_id TEXT;
        ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS organization_id TEXT;

        -- Team Workspace (RBAC)
        CREATE TABLE IF NOT EXISTS "team" (
          id TEXT PRIMARY KEY,
          owner_id TEXT NOT NULL,
          organization_id TEXT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'Editor',
          status TEXT NOT NULL DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Custom Domains & Subdomains
        CREATE TABLE IF NOT EXISTS "domains" (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          organization_id TEXT,
          site TEXT NOT NULL,
          domain TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'Subdomain',
          ssl TEXT NOT NULL DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Media Library Assets (Cloudflare R2 Storage metadata)
        CREATE TABLE IF NOT EXISTS "media" (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          organization_id TEXT,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'image/jpeg',
          size TEXT NOT NULL DEFAULT '240 KB',
          dimensions TEXT NOT NULL DEFAULT '1200 x 800',
          category TEXT NOT NULL DEFAULT 'General',
          uploaded_at TIMESTAMP DEFAULT NOW()
        );

        -- Form Submissions & Leads Capture
        CREATE TABLE IF NOT EXISTS "leads" (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          organization_id TEXT,
          site TEXT NOT NULL,
          form_name TEXT NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'New',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `).catch((err: any) => {
        console.warn('Auto table creation warning:', err.message);
      });

    } catch (err: any) {
      console.warn('[AI Studio] Could not initialize PostgreSQL pool:', err.message);
      global._postgresPool = {
        query: async () => ({ rows: [] }),
        connect: async () => ({
          query: async () => ({ rows: [] }),
          release: () => {}
        }),
        on: () => {},
        end: async () => {}
      };
    }
  }
  return global._postgresPool;
};

const pool = createPool();

let dbInstance: any;
if (isDbConfigured) {
  try {
    dbInstance = drizzle(pool, { schema });
  } catch (err) {
    console.warn('[AI Studio] Database not connected — using mock proxy', err);
    const noOp = {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (d: any) => d?.data ?? {},
      update: async (d: any) => d?.data ?? {},
      delete: async () => ({})
    };
    dbInstance = new Proxy({}, {
      get: (_, prop) => prop === 'query'
        ? new Proxy({}, { get: () => noOp })
        : async () => [],
    });
  }
} else {
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({})
  };
  dbInstance = new Proxy({}, {
    get: (_, prop) => prop === 'query'
      ? new Proxy({}, { get: () => noOp })
      : async () => [],
  });
}

export const db = dbInstance;
export { pool };
