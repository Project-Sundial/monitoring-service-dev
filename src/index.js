import 'dotenv/config';
import app from './app.js';
import setupJobs from './utils/setupJobs.js';

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  setupJobs();
});
