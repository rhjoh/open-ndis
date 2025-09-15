import { Router, Request, Response } from 'express';

const router = Router();

// Scheduling API (scaffold only)
// Handlers return 501 Not Implemented for now

router.get('/', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'List scheduling not implemented' });
});

router.post('/', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Create scheduling not implemented' });
});

router.get('/:id', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Get scheduling by id not implemented' });
});

router.put('/:id', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Replace scheduling not implemented' });
});

router.patch('/:id', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Update scheduling not implemented' });
});

router.delete('/:id', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'Delete scheduling not implemented' });
});

export default router;

