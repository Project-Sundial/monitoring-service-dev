import PgBoss from 'pg-boss';
import readSecretSync from '../utils/readSecretSync.js';
import { dbGetAllMonitors } from './queries.js';
import { calculateDelay } from '../utils/calculateDelay.js';
import startWorker from '../workers/startWorker.js';
import endWorker from '../workers/endWorker.js';
import soloWorker from '../workers/soloWorker.js';

const MissedPingsMq = {
  boss: null,
  startJobs: [],
  endJobs: [],
  soloJobs: [],

  async init() {
    const password = readSecretSync();
    const credentials = {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: password,
      port: 5432,
    };

    this.boss = new PgBoss(credentials);
    this.boss.on('error', error => console.error(error));

    await this.boss.start();
    await this.boss.deleteAllQueues();
    await this.boss.work('start', startWorker);
    await this.boss.work('end', endWorker);
    await this.boss.work('solo', soloWorker);

    console.log('PgBoss initialized and ready for use.');
  },

  async populateStartSoloQueues() {
    await this.boss.deleteAllQueues();
    const monitors = await dbGetAllMonitors();

    const monitorJobs = monitors.reduce((arr, monitor ) => {
      if (monitor.type === 'dual') {
        arr.push(MissedPingsMq.addStartJob({ monitorId: monitor.id }, calculateDelay(monitor)));
      } else {
        arr.push(MissedPingsMq.addSoloJob({ monitorId: monitor.id }, calculateDelay(monitor)));
      }
      return arr;
    }, []);

    Promise.allSettled(monitorJobs);
  },

  async addStartJob(data, delay) {
    const jobId = await this.boss.sendAfter('start', data, {}, delay);
    this.startJobs[data.monitorId] = jobId;
  },

  async addEndJob(data, delay) {
    const jobId = await this.boss.sendAfter('end', data, {}, delay);
    this.endJobs[data.runToken] = jobId;
  },

  async addSoloJob(data, delay) {
    const jobId = await this.boss.sendAfter('solo', data, {}, delay);
    this.soloJobs[data.monitorId] = jobId;
  },

  async removeStartJob(monitorId) {
    const jobId = this.startJobs[monitorId];
    await this.boss.cancel(jobId);
  },

  async removeEndJob(runToken) {
    const jobId = this.endJobs[runToken];
    await this.boss.cancel(jobId);
  },

  async removeSoloJob(monitorId) {
    const jobId = this.soloJobs[monitorId];
    await this.boss.cancel(jobId);
  }
};

export default MissedPingsMq;
