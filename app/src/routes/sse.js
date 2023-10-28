import express from 'express';
const router = express.Router();
import { getSse } from '../controllers/sse.js';

router.get('/', getSse);

export default router;
