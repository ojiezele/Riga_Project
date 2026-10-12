import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization, bearer, admin } from 'better-auth/plugins';
import bcrypt from 'bcryptjs';
import { db, pool } from '../db/index.ts';
import * as schema from '../db/schema.ts';

// Cryptographic Password Hashing (Enterprise Grade)
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  if (!plainText || !hashed) return false;
  try {
    return await bcrypt.compare(plainText, hashed);
  } catch (err) {
    return false;
  }
}

// Better Auth Server Configuration with Neon PostgreSQL Drizzle Adapter
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'riga_enterprise_saas_better_auth_secret_998877665544332211',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'https://*.run.app',
    'https://ais-dev-lgjqw5bj5zokjqosapxkbb-67146586635.europe-west3.run.app',
    'https://ais-pre-lgjqw5bj5zokjqosapxkbb-67146586635.europe-west3.run.app',
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'Owner',
      },
      plan: {
        type: 'string',
        required: false,
        defaultValue: 'WordPress Pro SaaS',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user: any) => {
          try {
            const orgId = 'org_' + Date.now();
            const orgSlug = `${(user.name || user.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '-')}-ws-${Math.random().toString(36).substring(2, 7)}`;
            
            await db.insert(schema.organization).values({
              id: orgId,
              name: `${user.name || 'Owner'}'s Workspace`,
              slug: orgSlug,
              createdAt: new Date(),
            });

            await db.insert(schema.member).values({
              id: 'mem_' + Date.now(),
              organizationId: orgId,
              userId: user.id,
              role: 'owner',
              createdAt: new Date(),
            });

            await db.insert(schema.subscriptions).values({
              id: 'sub_' + Date.now(),
              userId: user.id,
              organizationId: orgId,
              plan: 'WordPress Pro SaaS',
              status: 'active',
              price: '$49',
              seats: 5,
              storageGb: 50,
              sitesLimit: 20,
            });
          } catch (hookErr) {
            console.warn('Better Auth user.create.after hook notice:', hookErr);
          }
        }
      }
    }
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      roles: {
        owner: {
          permissions: ['*'],
        },
        admin: {
          permissions: ['read', 'write', 'delete', 'invite'],
        },
        editor: {
          permissions: ['read', 'write'],
        },
        member: {
          permissions: ['read'],
        },
        viewer: {
          permissions: ['read'],
        },
      },
    }),
    bearer(),
    admin(),
  ],
});
