import { Request, Response, NextFunction } from 'express';

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
    slug: string;
    name: string;
  };
}

/**
 * Resolves the active tenant from subdomain or custom headers without vendor lock-in.
 */
export async function tenantResolverMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const tenantHeader = req.headers['x-tenant-id'] as string;
    const host = req.headers.host || '';
    const parts = host.split('.');
    const subdomain = parts.length > 2 ? parts[0] : null;

    const tenantIdentifier = tenantHeader || subdomain || 'default';

    const tenant = {
      id: 'tenant_' + tenantIdentifier,
      slug: tenantIdentifier,
      name: tenantIdentifier.toUpperCase(),
    };

    req.tenant = tenant;
    next();
  } catch (err) {
    console.error('Tenant resolution error:', err);
    return res.status(500).json({ error: 'Internal tenant resolution error' });
  }
}
