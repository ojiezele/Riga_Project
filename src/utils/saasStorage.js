// Client-side SaaS persistence utility with local storage fallback
// Ensures uninterrupted user experience even when backend API is starting up or temporarily offline

const SAAS_STORAGE_KEY = 'riga_saas_workspace_state_v1';

export const DEFAULT_SAAS_STATE = {
  user: {
    name: "Alex Rivera",
    email: "alex@rigastudio.agency",
    role: "Owner",
    plan: "Riga Enterprise Pro",
    workspace: "Riga_Project"
  },
  sites: [
    {
      id: "site_foodymax",
      name: "foodymax",
      subdomain: "foodymax-297.riga.site",
      customDomain: "foodymax.delivery",
      tag: "SaaS",
      category: "SaaS & Marketing",
      status: "published",
      statusBadge: "Production Live",
      theme: "standard/Y1_a_1_Column_Layout",
      visitors: "94.2k",
      bounceRate: "18.2%",
      conversion: "4.82%",
      updated: "Edited 12m ago",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_rigastudio",
      name: "Riga Studio Design",
      subdomain: "rigastudio.riga.site",
      customDomain: "rigastudio.agency",
      tag: "Portfolio",
      category: "Portfolio",
      status: "published",
      statusBadge: "Production Live",
      theme: "standard/Y0_Blank",
      visitors: "32.6k",
      bounceRate: "28.4%",
      conversion: "3.15%",
      updated: "Edited 2h ago",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "site_cloudstack",
      name: "CloudStack Portal",
      subdomain: "cloudstack.riga.site",
      customDomain: "cloudstack-preview.canvas.sh",
      tag: "SaaS",
      category: "SaaS & Marketing",
      status: "staging",
      statusBadge: "Staging v2.4",
      theme: "standard/Y0_Blank",
      visitors: "15.4k",
      bounceRate: "22.1%",
      conversion: "2.90%",
      team: "4 reviewers",
      lastDeploy: "Build #819",
      updated: "Edited yesterday",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    }
  ],
  team: [
    {
      id: "t_1",
      name: "Alex Rivera",
      email: "alex@rigastudio.agency",
      role: "Owner",
      status: "Active",
      lastActive: "Just now",
      isPrimary: true,
      verified: true
    },
    {
      id: "t_2",
      name: "Sofia Lindqvist",
      email: "sofia@rigastudio.agency",
      role: "Administrator",
      status: "Active",
      lastActive: "2 hours ago",
      verified: false
    },
    {
      id: "t_3",
      name: "Marcus Brody",
      email: "marcus@client.com",
      role: "Editor",
      status: "Active",
      lastActive: "Oct 14",
      verified: false
    },
    {
      id: "t_4",
      name: "Emma Watson",
      email: "emma@partner.co",
      role: "Subscriber",
      status: "Pending Invite",
      lastActive: "Never",
      verified: false
    }
  ],
  domains: [
    {
      id: "d_1",
      site: "foodymax",
      siteSub: "Production (v2.4)",
      domain: "foodymax-297.riga.site",
      type: "Subdomain",
      ssl: "Active",
      dnsStatus: "Propagated"
    },
    {
      id: "d_2",
      site: "foodymax",
      siteSub: "Apex Domain",
      domain: "foodymax.delivery",
      type: "Custom Apex",
      ssl: "Active",
      dnsStatus: "Propagated"
    },
    {
      id: "d_3",
      site: "Riga Studio Design",
      siteSub: "Agency Portfolio",
      domain: "rigastudio.agency",
      type: "Custom Domain",
      ssl: "Issuing",
      dnsStatus: "Validating (1/2)"
    }
  ],
  media: [
    {
      id: "m_1",
      title: "hero-foodymax-autumn.webp",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      type: "WEBP",
      size: "420 KB",
      dimensions: "1920 × 1080",
      category: "Banners",
      uploadedAt: "Oct 14, 2026"
    },
    {
      id: "m_2",
      title: "foodymax-logo-horizontal.svg",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      type: "SVG",
      size: "14 KB",
      dimensions: "Vector scalable",
      category: "Logos",
      uploadedAt: "Oct 12, 2026"
    },
    {
      id: "m_3",
      title: "builder-canvas-preview.png",
      url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      type: "PNG",
      size: "890 KB",
      dimensions: "1280 × 800",
      category: "UI",
      uploadedAt: "Oct 11, 2026"
    },
    {
      id: "m_4",
      title: "alex-founder-portrait.jpg",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      type: "JPG",
      size: "112 KB",
      dimensions: "800 × 800",
      category: "Team",
      uploadedAt: "Oct 08, 2026"
    },
    {
      id: "m_5",
      title: "gourmet-burger-menu.webp",
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
      type: "WEBP",
      size: "340 KB",
      dimensions: "1200 × 800",
      category: "Banners",
      uploadedAt: "Oct 06, 2026"
    },
    {
      id: "m_6",
      title: "system-icons-sprite.svg",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      type: "SVG",
      size: "28 KB",
      dimensions: "Vector symbol pack",
      category: "UI",
      uploadedAt: "Oct 01, 2026"
    }
  ],
  leads: [
    {
      id: "lead_1",
      site: "foodymax · Inbound Enterprise",
      name: "Sarah Jenkins",
      initials: "SJ",
      avatarBg: "bg-purple-100 text-purple-700",
      email: "sarah.j@enterprise.co",
      message: "Interested in custom menu integration and wholesale ordering pipeline for 14 regional locations.",
      date: "10 mins ago",
      time: "Today, 10:24 AM",
      status: "New"
    },
    {
      id: "lead_2",
      site: "foodymax · Demo Request",
      name: "David Chen",
      initials: "DC",
      avatarBg: "bg-blue-100 text-blue-700",
      email: "david@chencapital.io",
      message: "Can we schedule a 15-minute walkthrough of the edge-hosted delivery tracking module?",
      date: "1 hour ago",
      time: "Today, 09:15 AM",
      status: "New"
    },
    {
      id: "lead_3",
      site: "Riga Portfolio · Contact Form",
      name: "Elena Rostova",
      initials: "ER",
      avatarBg: "bg-blue-100 text-blue-700",
      email: "elena@nordicdesign.se",
      message: "Loving the site speed! Are you accepting commissions for architectural interior portfolio templates?",
      date: "Yesterday",
      time: "4:42 PM",
      status: "Contacted"
    },
    {
      id: "lead_4",
      site: "foodymax · Newsletter",
      name: "Marcus Brody",
      initials: "MB",
      avatarBg: "bg-blue-100 text-blue-700",
      email: "marcus@fastretail.com",
      message: "Subscribed to weekly product drop alerts and seasonal chef menus.",
      date: "Oct 14, 2026",
      time: "11:18 AM",
      status: "Contacted"
    },
    {
      id: "lead_5",
      site: "foodymax · Partnership",
      name: "Chloe Bennett",
      initials: "CB",
      avatarBg: "bg-slate-100 text-slate-700",
      email: "c.bennett@growthlab.com",
      message: "Inquiry regarding influencer co-marketing campaign and coupon funnel activation.",
      date: "Oct 12, 2026",
      time: "02:30 PM",
      status: "Archived"
    }
  ],
  activity: [
    {
      id: "act_1",
      user: "Alex Rivera",
      action: "invited Emma Watson as Subscriber",
      timestamp: "Oct 16, 14:22 GMT",
      type: "invite"
    },
    {
      id: "act_2",
      user: "Alex Rivera",
      action: "promoted Sofia Lindqvist from Editor to Administrator",
      timestamp: "Oct 12, 09:14 GMT",
      type: "promote"
    },
    {
      id: "act_3",
      user: "System",
      action: "enforced 2FA credential requirement for Riga Studio Organization",
      timestamp: "Oct 01, 00:00 GMT",
      type: "security"
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
