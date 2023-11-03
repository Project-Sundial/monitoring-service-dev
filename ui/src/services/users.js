import axios from 'axios';
import { BASE_URL, CREATE_USER, LOGIN_USER, CHECK_DB_ADMIN } from '../constants/routes';

export const createUser = async(userData) => {
    const { data } = await axios.post(BASE_URL + CREATE_USER, userData);
    return data;
}

export const logInUser = async(userData) => {
    const { data } = await axios.post(BASE_URL + LOGIN_USER, userData);
    return data;
}

export const checkDBAdmin = async() => {
    const { data } = await axios.get(BASE_URL + CHECK_DB_ADMIN);
    return data;
}