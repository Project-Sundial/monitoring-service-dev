import { dbGetOverdue, dbUpdateFailingMonitors } from '../db/queries.js';
import slack from './providers/slack.js';
import formatNotification from './formatNotification.js';

(async () => {
  try {
    const overdueMonitors = await dbGetOverdue();
    console.log(overdueMonitors);
    await dbUpdateFailingMonitors(overdueMonitors.map(({ id }) => id));
    await Promise.all(overdueMonitors.map(monitor => {
      return slack.sendNotification(formatNotification(monitor));
    }));
  } catch (error) {
    console.log(error);
  }
})();
