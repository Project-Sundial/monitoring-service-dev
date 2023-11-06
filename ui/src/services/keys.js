
import axios from 'axios';
import { BASE_URL, GET_KEYS, CREATE_KEY, ADD_KEY_NAME } from "../constants/routes";

export const getAPIKeys = async () => {
    const { data } = await axios.get(BASE_URL + GET_KEYS);
    return data;
}

export const addAPIKey = async() => {
    await axios.post(BASE_URL + CREATE_KEY);
}

export const addAPIKeyName = async(id, name) => {
    await axios.put(BASE_URL + ADD_KEY_NAME + id, name);
}