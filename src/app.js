import express from 'express';
import cors from 'cors';
import router from './routes/api.js';
import home from './routes/home.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', home);
app.use('/api', router);

export default app;
