import { jest }  from '@jest/globals';
import httpMocks from 'node-mocks-http';
import { nanoid } from 'nanoid';
import * as monitorController from '../controllers/monitor';
import * as sse from '../controllers/sse';
import * as queries from '../db/queries';

jest.mock('nanoid', () => {
  return {
    nanoid: jest.fn()
  };
});
jest.mock('../db/queries');
jest.mock('../controllers/sse');
jest.mock('../utils/readSecretSync');
jest.mock('../db/config', () => {});

const mockData = [
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
];

afterEach(() => {
  jest.clearAllMocks();
});

test('all monitors can be retrieved', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();

  queries.dbGetAllMonitors.mockResolvedValue(mockData);

  await monitorController.getMonitors(req, res);

  expect(queries.dbGetAllMonitors).toHaveBeenCalledTimes(1);
  expect(res.statusCode).toBe(200);
  expect(res._getJSONData()).toEqual(mockData);
});

test('a single monitor can be retrieved', async () => {
  const id = 1;
  const req = httpMocks.createRequest({
    params: {
      id
    }
  });
  const res = httpMocks.createResponse();

  const index = id - 1;
  queries.dbGetMonitorById.mockResolvedValue(mockData[index]);

  await monitorController.getMonitor(req, res);

  expect(queries.dbGetMonitorById).toHaveBeenCalledTimes(1);
  expect(queries.dbGetMonitorById).toHaveBeenCalledWith(id);
  expect(res.statusCode).toBe(200);
  expect(res._getJSONData()).toEqual(mockData[index]);
});

test('a non existent monitor cannot be retrieved', async () => {
  const id = 100;
  const req = httpMocks.createRequest({
    params: {
      id,
    }
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  queries.dbGetMonitorById.mockResolvedValue(null);

  await monitorController.getMonitor(req, res, next);

  expect(queries.dbGetMonitorById).toHaveBeenCalledTimes(1);
  expect(queries.dbGetMonitorById).toHaveBeenCalledWith(id);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(next.mock.calls[0][0].message).toBe('Unable to find monitor associated with that id.');
  expect(next.mock.calls[0][0].statusCode).toBe(404);
});

test('a monitor can be added', async () => {
  const newMonitor = {
    schedule: '* * * * *',
    command: 'test-job.sh',
    tolerableRuntime: '25',
    type: 'dual'
  };
  const req = httpMocks.createRequest();
  req.body = newMonitor;
  const res = httpMocks.createResponse();

  const index = 0;
  queries.dbAddMonitor.mockResolvedValue(mockData[index]);
  nanoid.mockReturnValue(mockData[index].endpoint_key);

  await monitorController.addMonitor(req, res);

  expect(queries.dbAddMonitor).toHaveBeenCalledTimes(1);
  expect(nanoid).toHaveBeenCalledTimes(1);
  expect(queries.dbAddMonitor).toHaveBeenCalledWith({
    endpointKey: mockData[index].endpoint_key,
    ...newMonitor,
  });
  expect(sse.sendNewMonitor).toHaveBeenCalledTimes(1);
  expect(sse.sendNewMonitor).toHaveBeenCalledWith(mockData[index]);
  expect(res.statusCode).toBe(201);
  expect(res._getJSONData()).toEqual(mockData[index]);
});

test('an incorrectly formatted monitor cannot be added', async () => {
  const newMonitor = {
    prop: 'this is nonsense'
  };
  const req = httpMocks.createRequest();
  req.body = newMonitor;
  const res = httpMocks.createResponse();
  const next = jest.fn();

  nanoid.mockReturnValue(mockData[0].endpoint_key);

  await monitorController.addMonitor(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(next.mock.calls[0][0].message).toBe('Missing or incorrect schedule.');
  expect(next.mock.calls[0][0].statusCode).toBe(400);
});

test('a monitor can be updated', async () => {
  const id = 1;
  const updatedMonitor = {
    name: 'updated monitor',
    schedule: '* * * * *',
    command: 'test-job.sh',
    tolerableRuntime: '25',
  };
  const req = httpMocks.createRequest({
    params: {
      id,
    }
  });
  req.body = updatedMonitor;
  const res = httpMocks.createResponse();

  const index = 0;
  queries.dbUpdateMonitor.mockResolvedValue(mockData[index]);

  await monitorController.updateMonitor(req, res);

  expect(queries.dbUpdateMonitor).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateMonitor).toHaveBeenCalledWith(id, updatedMonitor);
  expect(sse.sendUpdatedMonitor).toHaveBeenCalledTimes(1);
  expect(sse.sendUpdatedMonitor).toHaveBeenCalledWith(mockData[index]);
  expect(res.statusCode).toBe(200);
  expect(res._getJSONData()).toEqual(mockData[index]);
});

test('a non existent monitor cannot be updated', async () => {
  const id = 100;
  const updatedMonitor = {
    name: 'updated monitor',
    schedule: '* * * * *',
    command: 'test-job.sh',
    tolerableRuntime: '25',
  };
  const req = httpMocks.createRequest({
    params: {
      id,
    }
  });
  req.body = updatedMonitor;
  const res = httpMocks.createResponse();
  const next = jest.fn();

  queries.dbUpdateMonitor.mockResolvedValue(null);

  await monitorController.updateMonitor(req, res, next);

  expect(queries.dbUpdateMonitor).toHaveBeenCalledTimes(1);
  expect(queries.dbUpdateMonitor).toHaveBeenCalledWith(id, updatedMonitor);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(next.mock.calls[0][0].message).toBe('Unable to find monitor associated with that id.');
  expect(next.mock.calls[0][0].statusCode).toBe(404);
});

test('a monitor can be deleted', async () => {
  const id = 1;
  const req = httpMocks.createRequest({
    params: {
      id
    }
  });
  const res = httpMocks.createResponse();

  const index = id - 1;
  queries.dbDeleteMonitor.mockResolvedValue(mockData[index]);

  await monitorController.deleteMonitor(req, res);

  expect(queries.dbDeleteMonitor).toHaveBeenCalledTimes(1);
  expect(queries.dbDeleteMonitor).toHaveBeenCalledWith(id);
  expect(res.statusCode).toEqual(204);
});

test('a non existent monitor cannot be deleted', async () => {
  const id = 100;
  const req = httpMocks.createRequest({
    params: {
      id,
    }
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  queries.dbDeleteMonitor.mockResolvedValue(null);

  await monitorController.deleteMonitor(req, res, next);

  expect(queries.dbDeleteMonitor).toHaveBeenCalledTimes(1);
  expect(queries.dbDeleteMonitor).toHaveBeenCalledWith(id);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  expect(next.mock.calls[0][0].message).toBe('Unable to find monitor associated with that id.');
  expect(next.mock.calls[0][0].statusCode).toBe(404);
});
