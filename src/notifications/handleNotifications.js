import { dbGetOverdue, dbUpdateFailingMonitors } from '../db/queries.js';

(async () => {
  try {
    const overdueMonitors = await dbGetOverdue();
    console.log(overdueMonitors);
    await dbUpdateFailingMonitors(overdueMonitors.map(({ id }) => id));
  } catch (error) {
    console.log(error);
  }
})();
