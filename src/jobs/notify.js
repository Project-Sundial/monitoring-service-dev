import { dbGetOverdue } from '../db/queries.js';

(async () => {
  try {
    const response = await dbGetOverdue();
    const dueNotifications = response.rows;
    console.log(dueNotifications);
  } catch (error) {
    console.error('Failed retrieving overdue job from database.', error);
  }
})();

