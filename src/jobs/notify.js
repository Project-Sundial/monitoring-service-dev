import { dbGetOverdue } from '../db/queries.js';
import { updateFailed } from '../utils/notificationUpdates.js';
(async () => {
  try {
    const overdueMonitors = await dbGetOverdue();
    console.log(overdueMonitors);
    if (overdueMonitors.length > 0) {
      await updateFailed(overdueMonitors);
    }
  } catch (error) {
    console.error('Failed retrieving overdue job from database.', error);
  }
})();

