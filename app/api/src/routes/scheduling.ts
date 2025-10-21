import { Router, Request, Response } from 'express';
import { listCarers, listClients, createShift } from '../services/schedulingServices';
import { shiftInput } from '../types/shift';

const router = Router();

// Scheduling API (scaffold only)
// Handlers return 501 Not Implemented for now

router.get('/', (_req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented', message: 'List scheduling not implemented' });
});

router.get('/carers', async (_req: Request, res: Response) => {
  try {
    const carers = await listCarers();
    return res.status(200).json(carers)
  } catch {
    console.error('Error returning list of carers');
    return res.status(500).json({ error: 'internal_server_error', message: 'Could not retrieve carers' });
  }
});

router.get('/clients', async (_req: Request, res: Response) => {
  try {
    const clients = await listClients();
    return res.status(200).json(clients)
  } catch {
    console.error('Error returning list of clients');
    return res.status(500).json({ error: 'internal_server_error', message: 'Could not retrieve clients' })
  }
})

router.post('/newShift', async (req: Request, res: Response) => {
  try {
    const rawData: shiftInput = {
      carerID: req.body.formData.carer,
      clientID: req.body.formData.client,
      date: req.body.formData.date,
      startTime: req.body.formData.startTime,
      endTime: req.body.formData.endTime,
      location: req.body.formData.location,
      notes: req.body.formData.notes
    };
    await createShift(rawData);
    return res.status(201).json("New shift created");
  } catch (error) {
    console.error('Error creating shift:', error);
    return res.status(400).json({ error: 'bad_request' });
  }
})

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

