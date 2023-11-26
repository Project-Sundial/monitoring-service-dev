import { generateHash } from '../utils/bcrypt.js';
import { dbUpdateMachineIP, dbGetMonitorsByMachineID, dbDeleteNullIPMachines, dbAddMachine, dbGetMachineList, dbUpdateMachineName, dbDeleteMachine } from '../db/queries.js';
import generateAPIKey from '../utils/generateAPIKey.js';
import { getToken, findUnregisteredMachine, findMachine } from '../utils/register.js';

const addMachine = async (req, res, next) => {
  try {
    const apiKey = generateAPIKey();
    const hash = await generateHash(apiKey);

    const prefix = apiKey.slice(0, 8);

    await dbDeleteNullIPMachines();
    let data = await dbAddMachine(hash, prefix);
    //

    // POTENTIAL ERROR HERE WITH apiKey - watch out!!!

    //
    res.json({ apiKey: apiKey, id: data.id, prefix: prefix, name: data.name, created_at: data.created_at });
  } catch(error) {
    next(error);
  }
};

const addName = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const machine = await dbUpdateMachineName(name, id);
    res.json(machine);
  } catch(error) {
    next(error);
  }
};

const deleteMachine = async (req, res, next) => {
  try {
    const id = req.params.id;
    await dbDeleteMachine(id);
    res.json(204);
  } catch(error) {
    next(error);
  }
};

const addIP = async (req, res, next) => {
  try {
    const { remoteIP } = req.body;
    const apiKey = getToken(req);
    console.log(apiKey);
    const id = await findUnregisteredMachine(apiKey);
    console.log(id);

    if (id === null) {
      throw new Error('API key not found or not registered.');
    }

    await dbUpdateMachineIP(id, remoteIP);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const getMachineList = async (req, res, next) => {
  try {
    const list = await dbGetMachineList();
    res.json(list);
  } catch(error) {
    next(error);
  }
};

const getMachineMonitors = async (req, res, next) => {
  try {
    const apiKey = getToken(req);
    const machine = await findMachine(apiKey);
    const machineId = machine.id;
    const list = await dbGetMonitorsByMachineID(machineId);
    res.json(list);
  } catch(error) {
    next(error);
  }
};

export { addMachine, addName, addIP, getMachineList, getMachineMonitors, deleteMachine };
