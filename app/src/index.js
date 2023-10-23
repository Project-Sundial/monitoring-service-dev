import 'dotenv/config';
import app from './app.js';
import setupJobs from './utils/setupNotifications.js';

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Sundial app server listening on port ${port}`);
  setupJobs();
});
