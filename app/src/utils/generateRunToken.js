import crypto from 'crypto';
import { RUN_TOKEN_LENGTH } from '../constants/runToken.js';

const generateRunToken = () => {
  const bytes = crypto.randomBytes(RUN_TOKEN_LENGTH / 2);
  return bytes.toString('hex');
};

export default generateRunToken;
