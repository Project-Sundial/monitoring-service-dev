import { nanoid } from 'nanoid';
import axios from 'axios';

let cache;

const addJob = async (req, res, next) => {
  try {
    const { ...jobData } = req.body;
    const endpointKey = nanoid(10);

    const newJobData = {
      endpointKey,
      ...jobData
    };

    cache = newJobData;
    console.log('cache data:', cache);

    await axios.post('http://host.docker.internal:56789/trigger-sync');
    console.log('pinging the http server');
    res.send(200);
  } catch (error) {
    next(error);
  }
};

const getUpdates = (req, res, next) => {
  try {
    console.log('Getting updates from cache');
    res.send(cache);
  } catch (error) {
    next(error);
  }
};

const syncUpdates = (req, res, next) => {
  try {
    console.log('Successful crontab update for job with endpoint_key:', req.body);
    res.send(200);
  } catch (error) {
    next(error);
  }
};

export {
  getUpdates,
  addJob,
  syncUpdates,
};