import axios from 'axios';
import { BASE_URL, CREATE_USER } from '../constants/routes';

export const createUser = async(userData) => {
    const { data } = await axios.post(BASE_URL + CREATE_USER, userData);
    return data;
}