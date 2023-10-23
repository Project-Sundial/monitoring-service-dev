import axios from "axios";
import {
  BASE_URL,
  CREATE_MONITOR,
  GET_MONITORS,
  DELETE_MONITOR
} from "../constants/routes";

export const getMonitors = async () => {
  console.log(BASE_URL)
  const { data } = await axios.get(BASE_URL + GET_MONITORS);
  return data;
};

export const createMonitor = async (newMonitor) => {
  const { data } = await axios.post(BASE_URL + CREATE_MONITOR, newMonitor);
  return data;
};

export const deleteMonitor = async (id) => {
  await axios.delete(BASE_URL + DELETE_MONITOR + String(id));
};
