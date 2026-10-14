// Client-side SaaS persistence utility with local storage fallback
// Ensures uninterrupted user experience even when backend API is starting up or temporarily offline

const SAAS_STORAGE_KEY = 'riga_saas_workspace_state_v1';

export const DEFAULT_SAAS_STATE = {
  user: null,
  sites: [
    {
      id: "site_luminary",
      name: "Luminary Agency",
      subdomain: "luminary.design",
      category: "Portfolio",
      tag: "Agency",
      theme: "standard/Y1_a_1_Column_Layout",
      status: "published",
      statusBadge: "Published (SSL Active)",
      visitors: "42.5k",
      updated: "Edited 10 mins ago by Sarah",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_nordic",
      name: "Nordic Roast Co.",
      subdomain: "nordicroast.shop",
      category: "E-Commerce",
      tag: "E-Commerce",
      theme: "standard/Y5_e_Commerce_Layout",
      status: "published",
      statusBadge: "Published (Custom Domain)",
      visitors: "28.1k",
      updated: "Last edited yesterday",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_fintech",
      name: "Fintech Pulse SaaS",
      subdomain: "pulse-preview.riga.app",
      category: "SaaS & Marketing",
      tag: "SaaS",
      theme: "standard/Y1_a_1_Column_Layout",
      status: "staging",
      statusBadge: "Staging (v2.1)",
      visitors: "18.4k",
      updated: "Edited 3 days ago",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_elena",
      name: "Elena Rostova Studio",
      subdomain: "elenarostova.art",
      category: "Portfolio",
      tag: "Portfolio",
      theme: "standard/Y3_c_3_Column_Layout",
      status: "published",
      statusBadge: "Published",
      visitors: "9.2k",
      updated: "Last edited May 12",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_apex",
      name: "Apex Ventures Pitch",
      subdomain: "apex-deck.draft.internal",
      category: "SaaS & Marketing",
      tag: "Internal",
      theme: "standard/Y2_b_2_Column_Layout",
      status: "draft",
      statusBadge: "Draft (Password Protected)",
      visitors: "1.8k",
      updated: "Last edited May 10",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_devflow",
      name: "DevFlow Documentation",
      subdomain: "docs.devflow.io",
      category: "SaaS & Marketing",
      tag: "Knowledge",
      theme: "standard/Y4_d_Newsletter_Layout",
      status: "published",
      statusBadge: "Published",
      visitors: "42.6k",
      updated: "Published 2 weeks ago",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
    }
  ],
  team: [
    {
      id: "t_1",
      name: "Ojiezele",
      email: "ojiezele0@gmail.com",
      role: "Owner",
      status: "Active"
    },
    {
      id: "t_2",
      name: "Sarah Jenkins",
      email: "sarah@riga.site",
      role: "Administrator",
      status: "Active"
    },
    {
      id: "t_3",
      name: "Alex Rivera",
      email: "alex@riga.site",
      role: "Editor",
      status: "Pending"
    }
  ],
  domains: [
    {
      id: "d_1",
      site: "My Portfolio",
      domain: "portfolio.riga.site",
      type: "Subdomain",
      ssl: "Active"
    },
    {
      id: "d_2",
      site: "Startup Landing",
      domain: "startup.riga.site",
      type: "Subdomain",
      ssl: "Pending"
    }
  ],
  media: [
    {
      id: "m_1",
      title: "Modern Office Workspace Banner",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      type: "image/jpeg",
      size: "240 KB",
      dimensions: "1200 x 800",
      category: "Hero Banners",
      uploadedAt: "2026-10-10"
    },
    {
      id: "m_2",
      title: "Cloud Analytics Dashboard Mockup",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      type: "image/jpeg",
      size: "180 KB",
      dimensions: "1200 x 750",
      category: "Product UI",
      uploadedAt: "2026-10-10"
    },
    {
      id: "m_3",
      title: "Minimal Brand Logo Mark",
      url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      type: "image/png",
      size: "34 KB",
      dimensions: "512 x 512",
      category: "Logos & Icons",
      uploadedAt: "2026-10-09"
    },
    {
      id: "m_4",
      title: "Team Collaboration Meeting",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      type: "image/jpeg",
      size: "310 KB",
      dimensions: "1200 x 800",
      category: "Team",
      uploadedAt: "2026-10-08"
    }
  ],
  leads: [
    {
      id: "lead_1",
      site: "My Portfolio",
      formName: "Contact Inquiry",
      name: "Marcus Vance",
      email: "marcus@vancetech.io",
      message: "Hi, we are looking for a complete website overhaul for our SaaS platform. What is your turnaround time?",
      date: "2026-10-10 11:24",
      status: "New"
    },
    {
      id: "lead_2",
      site: "Startup Landing",
      formName: "Newsletter Waitlist",
      name: "Elena Rostova",
      email: "elena.design@gmail.com",
      message: "Subscribed to product updates waitlist.",
      date: "2026-10-09 17:40",
      status: "Contacted"
    },
    {
      id: "lead_3",
      site: "My Portfolio",
      formName: "Enterprise Consultation",
      name: "David Sterling",
      email: "d.sterling@acmecorp.com",
      message: "Requesting a demo for multi-region site hosting and team RBAC permissions.",
      date: "2026-10-08 09:15",
      status: "Archived"
    }
  ],
  activity: [
    {
      id: "act_1",
      user: "Ojiezele",
      action: "Published live updates to My Portfolio",
      site: "My Portfolio",
      timestamp: "12 minutes ago"
    },
    {
      id: "act_2",
      user: "Sarah Jenkins",
      action: "Connected custom domain acme.com",
      site: "Startup Landing",
      timestamp: "2 hours ago"
    },
    {
      id: "act_3",
      user: "Ojiezele",
      action: "Invited Alex Rivera as Editor",
      site: "Workspace",
      timestamp: "Yesterday"
    },
    {
      id: "act_4",
      user: "System",
      action: "Automated Let's Encrypt TLS 1.3 certificate issued",
      site: "portfolio.riga.site",
      timestamp: "2 days ago"
    }
  ]
};

export function getLocalSaasState() {
  let state = DEFAULT_SAAS_STATE;
  try {
    const raw = localStorage.getItem(SAAS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sites)) {
        state = parsed;
      }
    }
  } catch (e) {
    // localStorage not accessible
  }

  // Ensure subdomains use current AI Studio host if window is defined
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    const host = window.location.host;
    if (state.sites) {
      state.sites = state.sites.map(s => {
        if (s.subdomain && s.subdomain.includes('riga.site')) {
          const prefix = s.subdomain.split('.')[0];
          return { ...s, subdomain: `${prefix}.${host}` };
        }
        return s;
      });
    }
    if (state.domains) {
      state.domains = state.domains.map(d => {
        if (d.domain && d.domain.includes('riga.site')) {
          const prefix = d.domain.split('.')[0];
          return { ...d, domain: `${prefix}.${host}` };
        }
        return d;
      });
    }
  }

  return state;
}

export function saveLocalSaasState(state) {
  try {
    localStorage.setItem(SAAS_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}
