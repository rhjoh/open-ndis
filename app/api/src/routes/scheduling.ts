import { Router, Request, Response } from 'express';
import { listCarers, listClients, createShift, getAllShifts } from '../services/schedulingServices';
import { ShiftInsert } from '../types/shift';

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
    const rawData: ShiftInsert = {
      carerID: parseInt(req.body.formData.carer),
      clientID: parseInt(req.body.formData.client),
      date: req.body.formData.date,
      startTime: new Date(`${req.body.formData.date}T${req.body.formData.startTime}`),
      endTime: new Date(`${req.body.formData.date}T${req.body.formData.endTime}`),
      status: 'planned', // Should this be a number value mapped to shit status in db? 
      location: parseInt(req.body.formData.location),
      notes: req.body.formData.notes
    };
    await createShift(rawData);
    return res.status(201).json("New shift created");
  } catch (error) {
    console.error('Error creating shift:', error);
    return res.status(400).json({ error: 'bad_request' });
  }
})

router.get('/shifts', async (req: Request, res: Response) => {
  try {
    const allShifts = await getAllShifts();
    return res.status(200).json(allShifts)
  } catch (error) {
    console.log(error)
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

