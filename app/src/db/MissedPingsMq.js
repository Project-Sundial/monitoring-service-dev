import PgBoss from 'pg-boss';
import readSecretSync from '../utils/readSecretSync.js';

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
    await this.boss.work('start', this.startWorker);
    await this.boss.work('end', this.endWorker);
    await this.boss.work('solo', this.soloWorker);

    console.log('PgBoss initialized and ready for use.');
  },

  async startWorker(job) {
    console.log(job);
  },

  async endWorker(job) {
    console.log(job);
  },

  async soloWorker(job) {
    console.log(job);
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
