import MissedPingsMq from '../db/MissedPingsMq.js';
import {dbCallMaintenanceProcedure}  from '../db/queries.js'

const maintenanceWorker = async () => {
    console.log('maintenance: starting runs rotation');
    try {
        await dbCallMaintenanceProcedure();
        MissedPingsMq.scheduleRunRotation(); //schedule next rotation
    } catch(e) {
        console.error(e);
    }
}

export default maintenanceWorker;