import express from 'express';
const router = express.Router();

router.get('/', (_, res) => {
  const message = "Welcome to Sundial! The world's greatest "
    + "open-source cron job monitoring solution.";
  
  res.send(message);
});

router.post('/api/endpoint/:id', (req, res) => {
  const body = req.body;
  console.log(body);

  res.status(200).end();
});

export default router;