import 'dotenv/config';
import app from './app.js';
import setupJobs from './utils/setupNotifications.js';

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  setupJobs();
});
