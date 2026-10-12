import { pgTable, text, timestamp, boolean, serial, integer } from 'drizzle-orm/pg-core';

// -------------------------------------------------------------
// BETTER AUTH CORE TABLES
// -------------------------------------------------------------

// Better Auth: User table
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('Owner'),
  plan: text('plan').notNull().default('WordPress Pro SaaS'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Better Auth: Session table
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  activeOrganizationId: text('active_organization_id'),
  impersonatedBy: text('impersonated_by'),
});

// Better Auth: Account table (stores hashed credentials & OAuth links)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'), // Cryptographically hashed password
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Better Auth: Verification table
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Better Auth: Organization / Workspace table
export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  metadata: text('metadata'),
});

// Better Auth: Member table (RBAC: Owner, Admin, Editor, Member, Viewer)
export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Better Auth: Invitation table
export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// -------------------------------------------------------------
// ENTERPRISE SAAS BILLING & SUBSCRIPTIONS
// -------------------------------------------------------------
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id'),
  plan: text('plan').notNull().default('WordPress Pro SaaS'),
  status: text('status').notNull().default('active'),
  billingCycle: text('billing_cycle').notNull().default('monthly'),
  price: text('price').notNull().default('$49'),
  seats: integer('seats').notNull().default(5),
  storageGb: integer('storage_gb').notNull().default(50),
  sitesLimit: integer('sites_limit').notNull().default(20),
  features: text('features').default('["Cloudflare R2 Object Storage", "Global Edge CDN", "Unlimited Funnels", "Custom Domains with SSL", "Team RBAC Workspace"]'),
  currentPeriodEnd: timestamp('current_period_end').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// -------------------------------------------------------------
// APPLICATION TABLES (Sites, Domains, Media, Leads, Legacy Users)
// -------------------------------------------------------------

// Legacy / Compatible Users table (synced view, password stored securely in Better Auth account table)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull().default(''),
  role: text('role').notNull().default('Owner'),
  plan: text('plan').notNull().default('WordPress Pro SaaS'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Hosted Websites & Funnels (Shopify / WordPress Grade with Full JSON AST & Compiled HTML)
export const sites = pgTable('sites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id'),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull(),
  theme: text('theme').notNull().default('standard/Y1_a_1_Column_Layout'),
  htmlContent: text('html_content').default(''),
  jsonData: text('json_data').default(''),
  status: text('status').notNull().default('published'),
  visitors: text('visitors').notNull().default('0'),
  bundleSize: text('bundle_size').default('42 KB'),
  versionHash: text('version_hash'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Team Members (Workspace RBAC)
export const team = pgTable('team', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  organizationId: text('organization_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('Editor'),
  status: text('status').notNull().default('Active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Custom Domains & Subdomains
export const domains = pgTable('domains', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id'),
  site: text('site').notNull(),
  domain: text('domain').notNull(),
  type: text('type').notNull().default('Subdomain'),
  ssl: text('ssl').notNull().default('Active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Media Library Assets (Cloudflare R2 Object Storage metadata)
export const media = pgTable('media', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id'),
  title: text('title').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull().default('image/jpeg'),
  size: text('size').notNull().default('240 KB'),
  dimensions: text('dimensions').notNull().default('1200 x 800'),
  category: text('category').notNull().default('General'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Form Submissions & Leads
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id'),
  site: text('site').notNull(),
  formName: text('form_name').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});
