import axios from 'axios';
import {
  TRIGGER,
  PROTOCOL
} from '../constants/routes.js';

export const triggerSync = async (ip) => {
  console.log('trigger ' + ip);
  await axios.post(PROTOCOL + ip + TRIGGER);
};
