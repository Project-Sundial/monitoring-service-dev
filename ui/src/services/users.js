import axios from 'axios';
import { BASE_URL, CREATE_USER, LOGIN_USER, USER_COUNT } from '../constants/routes';

export const createUser = async(userData) => {
    const { data } = await axios.post(BASE_URL + CREATE_USER, userData);
    return data;
}

export const logInUser = async(userData) => {
    console.log(`Request made to ${BASE_URL + LOGIN_USER}`);
    const { data } = await axios.post(BASE_URL + LOGIN_USER, userData);
    return data;
}

export const checkDBAdmin = async() => {
    const { data } = await axios.get(BASE_URL + USER_COUNT);
    return data.count > 0;
}