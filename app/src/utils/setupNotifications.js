import Bree from 'bree';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupJobs = () => {
  const bree = new Bree({
    jobs: [
      {
        name: 'handleNotifications',
        interval: 'every 1 mins'
      }
    ],
    root: path.join(__dirname, '../notifications')
  });

  bree.start();
};

export default setupJobs;
