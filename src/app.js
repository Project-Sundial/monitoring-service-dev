import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  const message = "Welcome to Sundial! The world's greatest "
    + "open-source cron job monitoring solution.";
  
  res.send(message);
});

export default app;
