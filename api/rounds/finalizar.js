import dbConnect from '../../../../lib/dbConnect.js';
import { encerrarRodada } from '../../../../controllers/roundController.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PATCH') {
    req.params = { id: req.query.id };
    return encerrarRodada(req, res);
  }

  res.status(405).json({ error: 'Método não permitido' });
}
