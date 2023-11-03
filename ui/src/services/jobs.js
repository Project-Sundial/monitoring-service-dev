import axios from "axios";
import {
  BASE_URL,
  CREATE_JOB,
  GET_JOBS,
  GET_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  GET_RUNS,
} from "../constants/routes";
import { getConfig } from './config';

export const createJob = async (newJob) => {
  const config = getConfig();
  const { data } = await axios.post(BASE_URL + CREATE_JOB, newJob, config);
  return data;
};

export const getJobs = async () => {
  const config = getConfig();
  const { data } = await axios.get(BASE_URL + GET_JOBS, config);
  return data;
};

export const getJob = async (id) => {
  const config = getConfig();
  const { data } = await axios.get(BASE_URL + GET_JOB + id, config);
  return data;
};

export const updateJob = async (id, newJob) => {
  const config = getConfig();
  const { data } = await axios.put(BASE_URL + UPDATE_JOB + id, newJob, config);
  return data;
};

export const deleteJob = async (id) => {
  const config = getConfig();
  await axios.delete(BASE_URL + DELETE_JOB + String(id), config);
};

export const getRuns = async (id, limit, offset) => {
  const config = getConfig();
  const { data } = await axios.get(BASE_URL + GET_RUNS + String(id) + `?limit=${limit}&offset=${offset}`, config);
  return data;
};


