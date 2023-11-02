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

export const createJob = async (newJob) => {
  const { data } = await axios.post(BASE_URL + CREATE_JOB, newJob);
  return data;
};

export const getJobs = async () => {
  const { data } = await axios.get(BASE_URL + GET_JOBS);
  return data;
};

export const getJob = async (id) => {
  const { data } = await axios.get(BASE_URL + GET_JOB + id);
  return data;
};

export const updateJob = async (id, newJob) => {
  const { data } = await axios.put(BASE_URL + UPDATE_JOB + id, newJob);
  return data;
};

export const deleteJob = async (id) => {
  await axios.delete(BASE_URL + DELETE_JOB + String(id));
};

export const getRuns = async (id, limit, offset) => {
  const { data } = await axios.get(BASE_URL + GET_RUNS + String(id) + `?limit=${limit}&offset=${offset}`);
  return data;
};


