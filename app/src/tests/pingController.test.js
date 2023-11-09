import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import * as pingController from '../controllers/ping';
import * as sse from '../controllers/sse';
import * as queries from '../db/queries';
import MissedPingsMq from '../db/MissedPingsMq';
import handleNotifications from '../notifications/handleNotifications';

jest.mock('../db/queries');
jest.mock('../controllers/sse');
jest.mock('../utils/readSecretSync');
jest.mock('../db/config', () => {});
jest.mock('../db/MissedPingsMq');
jest.mock('../notifications/handleNotifications.js');

const mockData = {
  runs: [
    {
      time: '2023-10-31 18:16:11.94086',
      runToken: '3f5b19cab5',
    },
    {
      time : '2023-11-09T10:48:40.002Z',
      runToken: 'e69873dc5d',
    }
  ],
  monitors: [
    {
      id:1,
      endpoint_key:'2gVc5Eh2I6',
      schedule: '* * * * *',
      command: 'test-job.sh',
      active: true,
      failing: false,
      created_at:  '2023-10-31 18:16:11.94086',
      tolerable_runtime: 25,
      grace_period: 30,
      type: 'dual'
    },
    {
      id:2,
      endpoint_key:'3dFc5Eh1O9',
      schedule: '* * * * *',
      command: 'test-job-2.sh',
      active: true,
      failing: true,
      created_at:  '2023-10-31 18:16:11.94086',
      tolerable_runtime: 25,
      grace_period: 30,
      type: 'dual'
    }
  ]
};

afterEach(() => {
  jest.clearAllMocks();
});

test('monitor is retrieved when a ping arrives', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);

  await pingController.addPing(req, res);

  expect(queries.dbGetMonitorByEndpointKey).toHaveBeenCalledTimes(1);
  expect(queries.dbGetMonitorByEndpointKey).toHaveBeenCalledWith(endpoint_key);
  expect(res.statusCode).toBe(200);
});

test('start job is replaced when a starting ping arrives', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);

  await pingController.addPing(req, res);

  expect(MissedPingsMq.removeStartJob).toHaveBeenCalledTimes(1);
  expect(MissedPingsMq.removeStartJob).toHaveBeenCalledWith(mockMonitor.id);
  expect(MissedPingsMq.addStartJob).toHaveBeenCalledTimes(1);
  expect(MissedPingsMq.addStartJob.mock.calls[0][0]).toEqual({ monitorId: mockMonitor.id });
  expect(res.statusCode).toBe(200);
});

test('new run is added and sent when starting ping arrives', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbAddRun.mockResolvedValue('new run');

  await pingController.addPing(req, res);

  expect(queries.dbAddRun).toHaveBeenCalledTimes(1);
  expect(queries.dbAddRun).toHaveBeenCalledWith({
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'started',
  });
  expect(sse.sendNewRun).toHaveBeenCalledTimes(1);
  expect(sse.sendNewRun).toHaveBeenCalledWith('new run');
  expect(res.statusCode).toBe(200);

});

test('end job is added when starting ping arrives', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);

  await pingController.addPing(req, res);

  expect(MissedPingsMq.addEndJob).toHaveBeenCalledTimes(1);
  expect(MissedPingsMq.addEndJob.mock.calls[0][0]).toEqual({
    runToken: mockRun.runToken,
    monitorId: mockMonitor.id,
  });
  expect(res.statusCode).toBe(200);
});

test('existing run (if present) is updated and sent when starting ping arrrives', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue({ state: 'no_start' });
  queries.dbUpdateNoStartRun.mockResolvedValue('updated run');

  await pingController.addPing(req, res);

  expect(queries.dbUpdateNoStartRun).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateNoStartRun).toHaveBeenCalledWith({
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'completed',
  });
  expect(sse.sendUpdatedRun).toHaveBeenCalledTimes(1);
  expect(sse.sendUpdatedRun).toHaveBeenCalledWith('updated run');
  expect(res.statusCode).toBe(200);
});

test('no end job created when existing run present and starting ping arrives', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue({ state: 'no_start' });

  await pingController.addPing(req, res);

  expect(MissedPingsMq.addEndJob).toHaveBeenCalledTimes(0);
  expect(res.statusCode).toBe(200);
});

test('end job is removed when ending ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'ending';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue({ state: 'started' });

  await pingController.addPing(req, res);

  expect(MissedPingsMq.removeEndJob).toHaveBeenCalledTimes(1);
  expect(MissedPingsMq.removeEndJob).toHaveBeenCalledWith(mockRun.runToken);
  expect(res.statusCode).toBe(200);
});

test('run is updated and sent when end ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'ending';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue({ state: 'started' });
  queries.dbUpdateStartedRun.mockResolvedValue('updated run');

  await pingController.addPing(req, res);

  expect(queries.dbUpdateStartedRun).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateStartedRun).toHaveBeenCalledWith({
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'completed'
  });
  expect(sse.sendUpdatedRun).toHaveBeenCalledTimes(1);
  expect(sse.sendUpdatedRun).toHaveBeenCalledWith('updated run');
  expect(res.statusCode).toBe(200);
});

test('if no existing run, run is created and sent when end ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'ending';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue(null);
  queries.dbAddRun.mockResolvedValue('new run');

  await pingController.addPing(req, res);

  expect(queries.dbAddRun).toHaveBeenCalledTimes(1);
  expect(queries.dbAddRun).toHaveBeenCalledWith({
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'no_start',
  });
  expect(sse.sendNewRun).toHaveBeenCalledTimes(1);
  expect(sse.sendNewRun).toHaveBeenCalledWith('new run');
  expect(res.statusCode).toBe(200);
});

test('failing monitor updated to recovered and notification sent when ending ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'ending';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 1;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue('existing run');
  queries.dbUpdateMonitorRecovered.mockResolvedValue('updated monitor');

  await pingController.addPing(req, res);

  expect(queries.dbUpdateMonitorRecovered).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateMonitorRecovered).toHaveBeenCalledWith(mockMonitor.id);
  expect(sse.sendUpdatedMonitor).toHaveBeenCalledTimes(1);
  expect(sse.sendUpdatedMonitor).toHaveBeenCalledWith('updated monitor');
  expect(handleNotifications).toHaveBeenCalledTimes(1);
  expect(handleNotifications).toHaveBeenCalledWith('updated monitor', {
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'completed',
  });
  expect(res.statusCode).toBe(200);
});

test('end job is removed when failing ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'failing';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue({ state: 'started' });

  await pingController.addPing(req, res);

  expect(MissedPingsMq.removeEndJob).toHaveBeenCalledTimes(1);
  expect(MissedPingsMq.removeEndJob).toHaveBeenCalledWith(mockRun.runToken);
  expect(res.statusCode).toBe(200);
});

test('run is updated and sent when failing ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'failing';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue({ state: 'started' });
  queries.dbUpdateStartedRun.mockResolvedValue('updated run');

  await pingController.addPing(req, res);

  expect(queries.dbUpdateStartedRun).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateStartedRun).toHaveBeenCalledWith({
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'failed',
  });
  expect(sse.sendUpdatedRun).toHaveBeenCalledTimes(1);
  expect(sse.sendUpdatedRun).toHaveBeenCalledWith('updated run');
  expect(res.statusCode).toBe(200);
});

test('if no existing run, run is created and sent when failing ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'failing';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbGetRunByRunToken.mockResolvedValue(null);
  queries.dbAddRun.mockResolvedValue('new run');

  await pingController.addPing(req, res);

  expect(queries.dbAddRun).toHaveBeenCalledTimes(1);
  expect(queries.dbAddRun).toHaveBeenCalledWith({
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'failed',
  });
  expect(sse.sendNewRun).toHaveBeenCalledTimes(1);
  expect(sse.sendNewRun).toHaveBeenCalledWith('new run');
  expect(res.statusCode).toBe(200);
});

test('non failing job updated to failing and notification sent when failing ping arrives', async () => {
  const runIndex = 1;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'failing';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();

  const monitorIndex = 0;
  const mockMonitor = mockData.monitors[monitorIndex];
  queries.dbGetMonitorByEndpointKey.mockResolvedValue(mockMonitor);
  queries.dbUpdateMonitorFailing.mockResolvedValue('updated monitor');

  await pingController.addPing(req, res);

  expect(queries.dbUpdateMonitorFailing).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateMonitorFailing).toHaveBeenCalledWith(mockMonitor.id);
  expect(sse.sendUpdatedMonitor).toHaveBeenCalledTimes(1);
  expect(sse.sendUpdatedMonitor).toHaveBeenCalledWith('updated monitor');
  expect(handleNotifications).toHaveBeenCalledTimes(1);
  expect(handleNotifications).toHaveBeenCalledWith('updated monitor', {
    monitorId: mockMonitor.id,
    time: mockRun.time,
    runToken: mockRun.runToken,
    state: 'failed',
  });
  expect(res.statusCode).toBe(200);
});

test('cannot add ping associated with non existent monitor', async () => {
  const runIndex = 0;
  const mockRun = mockData.runs[runIndex];
  const endpoint_key = '2gVc5Eh2I6';
  const event = 'starting';
  const req = httpMocks.createRequest({
    params: {
      endpoint_key,
    },
    query: {
      event,
    },
  });
  req.body = mockRun;
  const res = httpMocks.createResponse();
  const next = jest.fn();

  queries.dbGetMonitorByEndpointKey.mockResolvedValue(null);

  await pingController.addPing(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(next.mock.calls[0][0].message).toBe('Unable to find monitor associated with that endpoint.');
  expect(next.mock.calls[0][0].statusCode).toBe(404);
});
