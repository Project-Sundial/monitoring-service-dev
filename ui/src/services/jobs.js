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

const config = (token) => {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }
};

export const createJob = async (newJob, token) => {
  if (!token) {
    throw new Error('Missing token - this error should not be seen.');
  }
  
  const { data } = await axios.post(BASE_URL + CREATE_JOB, newJob, config(token));
  return data;
};

export const getJobs = async (token) => {
  if (!token) {
    throw new Error('Missing token - this error should not be seen.');
  }
  
  const { data } = await axios.get(BASE_URL + GET_JOBS, config(token));
  return data;
};

export const getJob = async (id, token) => {
  if (!token) {
    throw new Error('Missing token - this error should not be seen.');
  }

  const { data } = await axios.get(BASE_URL + GET_JOB + id, config(token));
  return data;
};

export const updateJob = async (id, newJob, token) => {
  if (!token) {
    throw new Error('Missing token - this error should not be seen.');
  }

  const { data } = await axios.put(BASE_URL + UPDATE_JOB + id, newJob, config(token));
  return data;
};

export const deleteJob = async (id, token) => {
  if (!token) {
    throw new Error('Missing token - this error should not be seen.');
  }

  await axios.delete(BASE_URL + DELETE_JOB + String(id), config(token));
};

export const getRuns = async (id, limit, offset, token) => {
  if (!token) {
    throw new Error('Missing token - this error should not be seen.');
  }

  const { data } = await axios.get(BASE_URL + GET_RUNS + String(id) + `?limit=${limit}&offset=${offset}`, config(token));
  return data;
};
