import 'dotenv/config';
import app from './app.js';
import setupJobs from './utils/setupNotifications.js';
import missedPingsMqProvider from './db/missedPingsMqProvider.js';

const port = process.env.PORT;
app.listen(port, async () => {
  console.log(`Sundial app server listening on port ${port}`);
  setupJobs();

  // MQ tests please delete
  const MissedPingsMq = await missedPingsMqProvider();
  MissedPingsMq.addStartJob({ monitorId: 12 }, 5);
  MissedPingsMq.addEndJob({ monitorId: 15 }, 10);
  MissedPingsMq.addSoloJob({ monitorId: 20 }, 15);
});
