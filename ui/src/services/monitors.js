import axios from "axios";
import {
  BASE_URL,
  CREATE_MONITOR,
  GET_MONITORS,
  DELETE_MONITOR,
  GET_RUNS,
} from "../constants/routes";

export const getMonitors = async () => {
  const { data } = await axios.get(BASE_URL + GET_MONITORS);
  return data;
};

export const getRuns = async (id, limit, offset) => {
  const { data } = await axios.get(BASE_URL + GET_RUNS + String(id) + `?limit=${limit}&offset=${offset}`);
  return data;
};

export const createMonitor = async (newMonitor) => {
  const { data } = await axios.post(BASE_URL + CREATE_MONITOR, newMonitor);
  return data;
};

export const deleteMonitor = async (id) => {
  await axios.delete(BASE_URL + DELETE_MONITOR + String(id));
};