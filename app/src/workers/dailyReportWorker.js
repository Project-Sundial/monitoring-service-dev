import { dbGetFailingMonitors } from '../db/queries.js';
import formatDailyReport from '../notifications/formatDailyReport.js';
import slack from '../notifications/providers/slack.js';
import smtp from '../notifications/providers/smtp.js';

const dailyReportWorker = async () => {
  const monitors = await dbGetFailingMonitors();
  if (monitors.length === 0) {
    return;
  }

  const data = formatDailyReport(monitors);

  if (process.env.SLACK_WEBHOOK_URL) {
    slack.sendNotification(data);
  }

  if (process.env.SMTP_HOST) {
    smtp.sendNotification(data);
  }
};

export default dailyReportWorker;
