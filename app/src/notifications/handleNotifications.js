import slack from './providers/slack.js';
import smtp from './providers/smtp.js';
import formatNotification from './formatNotification.js';
import 'dotenv/config';

const handleNotifications = (monitor, run) => {
  const data = formatNotification(monitor, run);

  if (process.env.SLACK_WEBHOOK_URL) {
    slack.sendNotification(data);
  }

  if (process.env.SMTP_HOST) {
    smtp.sendNotification(data);
  }

};

export default handleNotifications;
