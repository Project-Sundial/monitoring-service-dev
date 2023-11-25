
import axios from 'axios';
import { BASE_URL, GET_MACHINES, CREATE_MACHINE, ADD_MACHINE_NAME } from "../constants/routes";

export const getMachines = async () => {
    const { data } = await axios.get(BASE_URL + GET_MACHINES);
    return data;
}

export const addMachine = async() => {
    const {data} = await axios.post(BASE_URL + CREATE_MACHINE);
    return data;
}

export const addMachineName = async(id, name) => {
    await axios.put(BASE_URL + ADD_MACHINE_NAME + id, name);
}