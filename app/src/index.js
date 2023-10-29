import 'dotenv/config';
import app from './app.js';
import MissedPingsMq from './db/MissedPingsMq.js';

const port = process.env.PORT;
app.listen(port, async () => {
  console.log(`Sundial app server listening on port ${port}`);
  await MissedPingsMq.init();
  await MissedPingsMq.populateStartSoloQueues();
});
