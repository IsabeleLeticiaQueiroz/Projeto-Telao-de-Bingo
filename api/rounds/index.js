import dbConnect from '../../../lib/dbConnect.js';
import { listarRodadas, criarRodada } from '../../../controllers/roundController.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    return listarRodadas(req, res);
  }
  if (req.method === 'POST') {
    return criarRodada(req, res);
  }
  res.status(405).json({ error: 'Método não permitido' });
}
