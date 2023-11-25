import { dbGetMachineList, dbGetMachineByNullIP } from '../db/queries.js';
import { compareWithHash } from './bcrypt.js';

export const getToken = (request) => {
  const authorization = request.get('authorization');
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '').trim();
  }
  return null;
};

export const findUnregisteredMachine = async (apiKey) => {
  const machine = await dbGetMachineByNullIP();
  const result = await compareWithHash(apiKey, machine.api_key_hash);
  return result ? machine.id : null;
};

export const findMachine = async (apiKey) => {
  const machineList = await dbGetMachineList();

  console.log(machineList);
  const comparePromises = machineList.map(async (machine) => {
    const result = await compareWithHash(apiKey, machine.api_key_hash);
    return result ? machine : null;
  });

  const matchingMachines = await Promise.all(comparePromises);
  console.log(matchingMachines);
  const firstMatchingMachine = matchingMachines.filter(machine => machine !== null)[0];
  return firstMatchingMachine || undefined; // Return undefined if no matching key is found.
};
