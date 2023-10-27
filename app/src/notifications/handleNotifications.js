import slack from './providers/slack.js';
import formatNotification from './formatNotification.js';

const handleNotifications = (monitor, run) => {
  console.log('in notification')
  const data = formatNotification(monitor, run);
  slack.sendNotification(data);
};

export default handleNotifications;