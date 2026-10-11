import fs from 'fs';
import path from 'path';
import { db, isDbConfigured } from './index.ts';
import { users, sites, team, domains, media, leads } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

const saasDbPath = path.resolve(process.cwd(), 'saas_db.json');

function getLocalSaasDb() {
  if (fs.existsSync(saasDbPath)) {
    try {
      return JSON.parse(fs.readFileSync(saasDbPath, 'utf-8'));
    } catch {
      // fallback
    }
  }
  return {
    user: {
      name: 'Ojiezele',
      email: 'ojiezele0@gmail.com',
      role: 'Owner',
      plan: 'WordPress Pro SaaS Multi-Tenant'
    },
    sites: [],
    team: [],
    domains: [],
    media: [],
    leads: [],
    activity: []
  };
}

function saveLocalSaasDb(data: any) {
  try {
    fs.writeFileSync(saasDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('[AI Studio] Could not save local saas_db.json:', err);
  }
}

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    return {
      uid,
      email: email || local.user?.email || 'ojiezele0@gmail.com',
      name: name || local.user?.name || 'Ojiezele',
      role: local.user?.role || 'Owner',
      plan: local.user?.plan || 'WordPress Pro SaaS Multi-Tenant'
    };
  }

  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }
    const inserted = await db.insert(users).values({
      uid,
      email,
      name: name || email.split('@')[0],
      role: 'Owner',
      plan: 'WordPress Pro SaaS Multi-Tenant',
    }).returning();
    return inserted[0];
  } catch (error) {
    console.warn('Database query failed in getOrCreateUser, using fallback:', error);
    const local = getLocalSaasDb();
    return {
      uid,
      email,
      name: name || email.split('@')[0],
      role: local.user?.role || 'Owner',
      plan: local.user?.plan || 'WordPress Pro SaaS Multi-Tenant'
    };
  }
}

export async function getSaasState(userId: string = 'ojiezele0') {
  if (!isDbConfigured) {
    return getLocalSaasDb();
  }

  try {
    const userList = await db.select().from(users).where(eq(users.uid, userId)).limit(1);
    const user = userList[0] || {
      name: 'Ojiezele',
      email: 'ojiezele0@gmail.com',
      role: 'Owner',
      plan: 'WordPress Pro SaaS Multi-Tenant'
    };

    const sitesList = await db.select().from(sites).where(eq(sites.userId, userId)).orderBy(desc(sites.updatedAt));
    const teamList = await db.select().from(team).where(eq(team.ownerId, userId)).orderBy(desc(team.createdAt));
    const domainList = await db.select().from(domains).where(eq(domains.userId, userId)).orderBy(desc(domains.createdAt));
    const mediaList = await db.select().from(media).where(eq(media.userId, userId)).orderBy(desc(media.uploadedAt));
    const leadsList = await db.select().from(leads).where(eq(leads.userId, userId)).orderBy(desc(leads.createdAt));

    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan
      },
      sites: sitesList.map((s: any) => ({
        id: s.id,
        name: s.name,
        subdomain: s.subdomain,
        theme: s.theme,
        status: s.status,
        visitors: s.visitors,
        htmlContent: s.htmlContent || '',
        jsonData: s.jsonData || '',
        updated: s.updatedAt ? s.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })),
      team: teamList.map((t: any) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        role: t.role,
        status: t.status
      })),
      domains: domainList.map((d: any) => ({
        id: d.id,
        site: d.site,
        domain: d.domain,
        type: d.type,
        ssl: d.ssl
      })),
      media: mediaList.map((m: any) => ({
        id: m.id,
        title: m.title,
        url: m.url,
        type: m.type,
        size: m.size,
        dimensions: m.dimensions,
        category: m.category,
        uploadedAt: m.uploadedAt ? m.uploadedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })),
      leads: leadsList.map((l: any) => ({
        id: l.id,
        site: l.site,
        formName: l.formName,
        name: l.name,
        email: l.email,
        message: l.message,
        date: l.createdAt ? l.createdAt.toISOString().slice(0, 16).replace('T', ' ') : new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: l.status
      }))
    };
  } catch (error) {
    console.warn('Database query failed in getSaasState, falling back to local database:', error);
    return getLocalSaasDb();
  }
}

export async function upsertSite(siteData: {
  id?: string;
  name: string;
  theme?: string;
  htmlContent?: string;
  jsonData?: any;
  status?: string;
  userId?: string;
}) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    if (siteData.id) {
      local.sites = (local.sites || []).map((s: any) => s.id === siteData.id ? {
        ...s,
        ...siteData,
        updated: new Date().toISOString().split('T')[0]
      } : s);
    } else {
      const id = 'site_' + Date.now();
      const subdomain = (siteData.name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-') + '.riga.site';
      const newSite = {
        id,
        name: siteData.name || 'New Website',
        subdomain,
        theme: siteData.theme || 'standard/Y1_a_1_Column_Layout',
        htmlContent: siteData.htmlContent || '',
        jsonData: siteData.jsonData || '',
        status: siteData.status || 'published',
        visitors: '0',
        updated: new Date().toISOString().split('T')[0]
      };
      local.sites = [...(local.sites || []), newSite];
      local.domains = [...(local.domains || []), {
        id: 'd_' + Date.now(),
        site: newSite.name,
        domain: subdomain,
        type: 'Subdomain',
        ssl: 'Active'
      }];
    }
    saveLocalSaasDb(local);
    return;
  }

  try {
    const userId = siteData.userId || 'ojiezele0';
    if (siteData.id) {
      await db.update(sites).set({
        name: siteData.name,
        ...(siteData.theme ? { theme: siteData.theme } : {}),
        ...(siteData.htmlContent !== undefined ? { htmlContent: siteData.htmlContent } : {}),
        ...(siteData.jsonData !== undefined ? { jsonData: typeof siteData.jsonData === 'string' ? siteData.jsonData : JSON.stringify(siteData.jsonData) } : {}),
        ...(siteData.status ? { status: siteData.status } : {}),
        updatedAt: new Date(),
      }).where(eq(sites.id, siteData.id));
    } else {
      const id = 'site_' + Date.now();
      const subdomain = (siteData.name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-') + '.riga.site';
      await db.insert(sites).values({
        id,
        userId,
        name: siteData.name || 'New Website',
        subdomain,
        theme: siteData.theme || 'standard/Y1_a_1_Column_Layout',
        htmlContent: siteData.htmlContent || '',
        jsonData: siteData.jsonData ? (typeof siteData.jsonData === 'string' ? siteData.jsonData : JSON.stringify(siteData.jsonData)) : '',
        status: siteData.status || 'published',
        visitors: '0',
      });
      await db.insert(domains).values({
        id: 'd_' + Date.now(),
        userId,
        site: siteData.name || 'New Website',
        domain: subdomain,
        type: 'Subdomain',
        ssl: 'Active',
      });
    }
  } catch (error) {
    console.warn('Database query failed in upsertSite, saving locally:', error);
    const local = getLocalSaasDb();
    if (siteData.id) {
      local.sites = (local.sites || []).map((s: any) => s.id === siteData.id ? { ...s, ...siteData } : s);
    } else {
      const id = 'site_' + Date.now();
      const subdomain = (siteData.name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-') + '.riga.site';
      local.sites = [...(local.sites || []), {
        id,
        name: siteData.name || 'New Website',
        subdomain,
        theme: siteData.theme || 'standard/Y1_a_1_Column_Layout',
        status: 'published',
        visitors: '0',
        updated: new Date().toISOString().split('T')[0]
      }];
    }
    saveLocalSaasDb(local);
  }
}

export async function deleteSite(siteId: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.sites = (local.sites || []).filter((s: any) => s.id !== siteId);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.delete(sites).where(eq(sites.id, siteId));
  } catch (error) {
    console.warn('Database query failed in deleteSite, deleting locally:', error);
    const local = getLocalSaasDb();
    local.sites = (local.sites || []).filter((s: any) => s.id !== siteId);
    saveLocalSaasDb(local);
  }
}

export async function insertTeamMember(data: { name: string; email: string; role?: string; ownerId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.team = [...(local.team || []), {
      id: 't_' + Date.now(),
      name: data.name || 'Team Member',
      email: data.email || 'member@riga.site',
      role: data.role || 'Editor',
      status: 'Pending'
    }];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 't_' + Date.now();
    await db.insert(team).values({
      id,
      ownerId: data.ownerId || 'ojiezele0',
      name: data.name || 'Team Member',
      email: data.email || 'member@riga.site',
      role: data.role || 'Editor',
      status: 'Pending',
    });
  } catch (error) {
    console.warn('Database query failed in insertTeamMember, adding locally:', error);
    const local = getLocalSaasDb();
    local.team = [...(local.team || []), {
      id: 't_' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || 'Editor',
      status: 'Pending'
    }];
    saveLocalSaasDb(local);
  }
}

export async function deleteTeamMember(id: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.team = (local.team || []).filter((t: any) => t.id !== id);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.delete(team).where(eq(team.id, id));
  } catch (error) {
    console.warn('Database query failed in deleteTeamMember, removing locally:', error);
    const local = getLocalSaasDb();
    local.team = (local.team || []).filter((t: any) => t.id !== id);
    saveLocalSaasDb(local);
  }
}

export async function updateTeamMember(data: { id: string; role?: string; status?: string; name?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.team = (local.team || []).map((t: any) => t.id === data.id ? { ...t, ...data } : t);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.update(team).set({
      ...(data.role ? { role: data.role } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.name ? { name: data.name } : {}),
    }).where(eq(team.id, data.id));
  } catch (error) {
    console.warn('Database query failed in updateTeamMember, updating locally:', error);
    const local = getLocalSaasDb();
    local.team = (local.team || []).map((t: any) => t.id === data.id ? { ...t, ...data } : t);
    saveLocalSaasDb(local);
  }
}

export async function insertDomain(data: { site: string; domain: string; userId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.domains = [...(local.domains || []), {
      id: 'd_' + Date.now(),
      site: data.site || 'Website',
      domain: data.domain,
      type: 'Custom Domain',
      ssl: 'Active'
    }];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 'd_' + Date.now();
    await db.insert(domains).values({
      id,
      userId: data.userId || 'ojiezele0',
      site: data.site || 'Website',
      domain: data.domain,
      type: 'Custom Domain',
      ssl: 'Active',
    });
  } catch (error) {
    console.warn('Database query failed in insertDomain, adding locally:', error);
    const local = getLocalSaasDb();
    local.domains = [...(local.domains || []), {
      id: 'd_' + Date.now(),
      site: data.site,
      domain: data.domain,
      type: 'Custom Domain',
      ssl: 'Active'
    }];
    saveLocalSaasDb(local);
  }
}

export async function insertMedia(data: { title: string; url: string; category?: string; userId?: string }) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.media = [{
      id: 'm_' + Date.now(),
      title: data.title || 'Uploaded Image',
      url: data.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      type: 'image/jpeg',
      size: '240 KB',
      dimensions: '1200 x 800',
      category: data.category || 'General',
      uploadedAt: new Date().toISOString().split('T')[0]
    }, ...(local.media || [])];
    saveLocalSaasDb(local);
    return;
  }
  try {
    const id = 'm_' + Date.now();
    await db.insert(media).values({
      id,
      userId: data.userId || 'ojiezele0',
      title: data.title || 'Uploaded Image',
      url: data.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      type: 'image/jpeg',
      size: '240 KB',
      dimensions: '1200 x 800',
      category: data.category || 'General',
    });
  } catch (error) {
    console.warn('Database query failed in insertMedia, adding locally:', error);
    const local = getLocalSaasDb();
    local.media = [{
      id: 'm_' + Date.now(),
      title: data.title,
      url: data.url,
      type: 'image/jpeg',
      size: '240 KB',
      dimensions: '1200 x 800',
      category: data.category || 'General',
      uploadedAt: new Date().toISOString().split('T')[0]
    }, ...(local.media || [])];
    saveLocalSaasDb(local);
  }
}

export async function deleteMedia(id: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.media = (local.media || []).filter((m: any) => m.id !== id);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.delete(media).where(eq(media.id, id));
  } catch (error) {
    console.warn('Database query failed in deleteMedia, removing locally:', error);
    const local = getLocalSaasDb();
    local.media = (local.media || []).filter((m: any) => m.id !== id);
    saveLocalSaasDb(local);
  }
}

export async function updateLeadStatus(id: string, status: string) {
  if (!isDbConfigured) {
    const local = getLocalSaasDb();
    local.leads = (local.leads || []).map((l: any) => l.id === id ? { ...l, status } : l);
    saveLocalSaasDb(local);
    return;
  }
  try {
    await db.update(leads).set({ status }).where(eq(leads.id, id));
  } catch (error) {
    console.warn('Database query failed in updateLeadStatus, updating locally:', error);
    const local = getLocalSaasDb();
    local.leads = (local.leads || []).map((l: any) => l.id === id ? { ...l, status } : l);
    saveLocalSaasDb(local);
  }
}
