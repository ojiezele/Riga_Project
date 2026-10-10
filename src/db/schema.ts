import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (keyed on Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull().default(''),
  role: text('role').notNull().default('Owner'),
  plan: text('plan').notNull().default('WordPress Pro SaaS'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Hosted Websites & Funnels
export const sites = pgTable('sites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull(),
  theme: text('theme').notNull().default('standard/Y1_a_1_Column_Layout'),
  htmlContent: text('html_content').default(''),
  jsonData: text('json_data').default(''),
  status: text('status').notNull().default('published'),
  visitors: text('visitors').notNull().default('0'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Team Members (RBAC)
export const team = pgTable('team', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('Editor'),
  status: text('status').notNull().default('Pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Custom Domains & Subdomains
export const domains = pgTable('domains', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  site: text('site').notNull(),
  domain: text('domain').notNull(),
  type: text('type').notNull().default('Subdomain'),
  ssl: text('ssl').notNull().default('Active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Media Library Assets
export const media = pgTable('media', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
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
  site: text('site').notNull(),
  formName: text('form_name').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});
