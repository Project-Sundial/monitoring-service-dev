import express from 'express';
const router = express.Router();

export default router.get('/', (_, res) => {
  const message = "Welcome to Sundial! The world's greatest "
    + 'open-source cron job monitoring solution.';

  res.send(message);
});
