import axios from 'axios';
import { BASE_URL, CREATE_USER, LOGIN_USER } from '../constants/routes';

export const createUser = async(userData) => {
    const { data } = await axios.post(BASE_URL + CREATE_USER, userData);
    return data;
}

export const loginUser = async(userData) => {
    const { data } = await axios.post(BASE_URL + LOGIN_USER, userData);
    return data;
}