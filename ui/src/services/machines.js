import axios from 'axios';
import { BASE_URL, GET_MACHINES, CREATE_MACHINE, ADD_MACHINE_NAME, DELETE_MACHINE } from "../constants/routes";

export const getMachines = async () => {
    const { data } = await axios.get(BASE_URL + GET_MACHINES);
    return data;
}

export const addMachine = async () => {
    const { data } = await axios.post(BASE_URL + CREATE_MACHINE);
    return data;
}

export const updateMachineName = async (machine) => {
    const { data} = await axios.put(BASE_URL + ADD_MACHINE_NAME + machine.id, machine);
    return data;
}

export const deleteMachine = async (id) => {
    await axios.delete(BASE_URL + DELETE_MACHINE + id);
}
