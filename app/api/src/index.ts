import express, { Request, Response } from 'express';
import schedulingRouter from './routes/scheduling';
import authRouter from './routes/auth';
import { authRequired } from './middleware/auth';
import type { User } from './types/auth';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ndis-api' });
});

// Mount feature routers
app.use('/auth', authRouter);

// Example protected route
app.get('/me', authRequired, (req: Request & { user?: User }, res: Response) => {
  const user = req.user!;
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.use('/scheduling', schedulingRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on http://localhost:${port}`);
});
