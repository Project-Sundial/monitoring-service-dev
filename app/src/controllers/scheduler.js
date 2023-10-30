import { nanoid } from 'nanoid';
import axios from 'axios';

let cache = [];

const addJob = async (req, res, next) => {
  try {
    const { ...jobData } = req.body;
    const endpointKey = nanoid(10);

    const newJobData = {
      endpointKey,
      ...jobData
    };

    cache.push(newJobData);
    console.log('cache data:', cache);

    //hard coded for now
    await axios.post('http://host.docker.internal:56789/trigger-sync');
    console.log('Pinging the http server');
    res.send(200);
  } catch (error) {
    next(error);
  }
};

const getUpdates = (req, res, next) => {
  try {
    console.log('Getting updates from backend to send to CLI', cache);
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