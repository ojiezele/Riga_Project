import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: DecodedIdToken | any;
  tenant?: any;
}
export type AuthenticatedRequest = AuthRequest;
export const oidcAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => requireAuth(req, res, next);

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    try {
      const fallbackSecret = process.env.JWT_SECRET || 'riga_saas_secret_key_99';
      const decodedJwt = jwt.verify(token, fallbackSecret);
      req.user = decodedJwt;
      next();
    } catch (jwtErr) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }
};
