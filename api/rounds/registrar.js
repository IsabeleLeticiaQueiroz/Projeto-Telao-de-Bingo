import dbConnect from '../../../../lib/dbConnect.js';
import { registrarBola } from '../../../../controllers/roundController.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    req.params = { id: req.query.id }; // Passa o parâmetro id para controller
    return registrarBola(req, res);
  }

  res.status(405).json({ error: 'Método não permitido' });
}
