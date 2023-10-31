import axios from 'axios';
import {
  BASE_URL,
  SYNC,
  DISCOVER,
} from "../constants/routes";

export const getMonitors = async () => {
  const { data } = await axios.get(BASE_URL + GET_MONITORS);
  return data;
};