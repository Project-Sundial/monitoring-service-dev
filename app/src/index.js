import 'dotenv/config';
import app from './app.js';
import setupJobs from './utils/setupNotifications.js';
import MissedPingsMq from './db/MissedPingsMq.js';

const port = process.env.PORT;
app.listen(port, async () => {
  console.log(`Sundial app server listening on port ${port}`);
  setupJobs();
  await MissedPingsMq.init();

  // MQ tests please delete
  MissedPingsMq.addStartJob({ monitorId: 2 }, 5);
  MissedPingsMq.addEndJob({ monitorId: 2 }, 10);
  MissedPingsMq.addSoloJob({ monitorId: 2 }, 15);
});
