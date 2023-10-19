import express from 'express';
import cors from 'cors';
import router from './routes/api.js';
import home from './routes/home.js';
import { errorLogger, errorResponder, invalidPathHandler } from './utils/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', home);
app.use('/api', router);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

export default app;
