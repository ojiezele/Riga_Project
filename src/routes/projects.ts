import { Router, Response } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant';
import { oidcAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.use(tenantResolverMiddleware);
router.use(oidcAuthMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    res.json({
      success: true,
      tenant: req.tenant,
      user: req.user,
      data: [
        { id: 'proj_1', name: 'SaaS Platform Redesign', tenantId },
        { id: 'proj_2', name: 'Enterprise Portal', tenantId }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tenant-scoped data' });
  }
});

export default router;
