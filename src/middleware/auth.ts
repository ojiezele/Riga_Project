import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TenantRequest } from './tenant';

export interface AuthenticatedRequest extends TenantRequest {
  user?: {
    sub: string;
    email: string;
    tenantId: string;
    roles: string[];
  };
}

/**
 * Standard OIDC / JWT verification middleware without third-party vendor lock-in.
 */
export function oidcAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization token' });
  }

  const token = authHeader.split(' ')[1];
  const secretOrKey = process.env.JWT_SECRET || 'riga-secure-fallback-secret';

  try {
    const decoded = jwt.verify(token, secretOrKey) as {
      sub: string;
      email: string;
      tenant_id?: string;
      org_id?: string;
      roles?: string[];
    };

    const userTenantId = decoded.tenant_id || decoded.org_id;

    if (req.tenant && userTenantId && userTenantId !== req.tenant.id) {
      return res.status(403).json({ error: 'Access denied: Tenant mismatch' });
    }

    req.user = {
      sub: decoded.sub || 'user_local',
      email: decoded.email || 'user@example.com',
      tenantId: userTenantId || req.tenant?.id || 'default',
      roles: decoded.roles || ['member'],
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
