import axios from 'axios';
import {
  LOCAL_HOST
} from '../constants/routes';

export const triggerSync = async () => {
  await axios.post(LOCAL_HOST);
};
