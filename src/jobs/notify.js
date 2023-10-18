import { dbGetOverdue } from '../db/queries.js';
import { update } from '../utils/notificationUpdates.js';
(async () => {
  try {
    const dueNotifications = await dbGetOverdue();
    console.log(dueNotifications);
    await update(dueNotifications);
  } catch (error) {
    console.error('Failed retrieving overdue job from database.', error);
  }
})();

