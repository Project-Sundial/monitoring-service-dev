import { dbGetMachineList, dbGetMachineByNullIP } from '../db/queries.js';
import { compareWithHash } from './bcrypt.js';
import bcrypt from 'bcryptjs';

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
  try {
    const machineList = await dbGetMachineList();
    const comparisonPromises = machineList.map(async (machine) => {
      const result = await bcrypt.compare(apiKey, machine.api_key_hash);
      return result;
    });

    const comparisonResults = await Promise.all(comparisonPromises);
    const index = comparisonResults.findIndex(result => result === true);
    if (index !== -1) {
      console.log('Match found!');
      return machineList[index]; // Return the matching machine
    }

    console.log('No matching key found.');
    return undefined; // Return undefined if no matching key is found.
  } catch (error) {
    console.error('Error in findMachine:', error);
    throw error;
  }
};
