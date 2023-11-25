import axios from 'axios';
import {
  TRIGGER
} from '../constants/routes.js';

export const triggerSync = async (ip) => {
  console.log('trigger ' + ip);
  await axios.post(ip + TRIGGER);
};
