import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ndis-api' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

