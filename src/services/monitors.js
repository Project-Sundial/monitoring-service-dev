import axios from "axios";
import {
  BASE_URL,
  CREATE_MONITOR,
  GET_MONITORS
} from "../constants/routes";

export const getMonitors = async () => {
  const { data } = await axios.get(BASE_URL + GET_MONITORS);
  return data;
};

export const createMonitor = async (newMonitor) => {
  console.log(newMonitor)
  const { data } = await axios.post(BASE_URL + CREATE_MONITOR, newMonitor);
  return data;
};