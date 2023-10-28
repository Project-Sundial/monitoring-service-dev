import express from 'express';
const router = express.Router();

export default router.get('/', (req, res) => {
  res.status(404).send('The URL you are trying to reach does not exist.');
});
