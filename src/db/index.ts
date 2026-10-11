import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

declare global {
  var _postgresPool: InstanceType<typeof Pool> | any;
}

import fs from 'fs';

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
