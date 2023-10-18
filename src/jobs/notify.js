import { dbGetOverdue } from '../db/queries.js';
import { update } from '../utils/notificationUpdates.js';
(async () => {
  try {
    const response = await dbGetOverdue();
    const dueNotifications = response.rows;
    console.log(dueNotifications);
    update(dueNotifications);
  } catch (error) {
    console.error('Failed retrieving overdue job from database.', error);
  }
})();

