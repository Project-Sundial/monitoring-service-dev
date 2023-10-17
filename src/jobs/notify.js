import db from '../db/queries.js';

const dueNotifications = await db.getOverdue();
console.log(dueNotifications);
