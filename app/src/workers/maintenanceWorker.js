import MissedPingsMq from '../db/MissedPingsMq.js';
import { dbCallMaintenanceProcedure }  from '../db/queries.js';

const maintenanceWorker = async () => {
  console.log('maintenance: starting runs rotation');
  try {
    await dbCallMaintenanceProcedure();
  } catch(e) {
    console.error(e);
  }
  MissedPingsMq.scheduleRunRotation(); //schedule next rotation
};

export default maintenanceWorker;