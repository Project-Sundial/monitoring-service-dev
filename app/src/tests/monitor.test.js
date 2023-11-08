import {jest} from '@jest/globals';
import httpMocks from 'node-mocks-http';

jest.mock('nanoid', () => {});
jest.mock('../notifications/handleNotifications', () => {});
jest.mock('../controllers/sse', () => {});
jest.mock('../utils/calculateDelays.js', () => {});
jest.mock('../db/MissedPingsMq.js', () => {});
jest.mock('../db/queries', () => {});

jest.mock('../controllers/monitor');
jest.mock('../routes/api');


import * as monitor from '../controllers/monitor';


test('all monitors are returned', async () => {
    const monitorsData = {
        id:1, 
        endpointKey:'2gVc5Eh2I6',
        command: 'test-job.sh',
        active: true,
        failing: false,
        created_at:  '2023-10-31 18:16:11.94086', 
        tolerable_runtime: 25,
        grace_period: 30,
        type: 'dual'
    }
    
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();


    jest.spyOn(monitor, 'getMonitors').mockReturnValue(monitorsData);
    const mdbGetMonitors = (req, res) => monitor.getMonitors(req, res);

    let result = await mdbGetMonitors(req, res);

    expect(result).toBe(monitorsData);
    expect(monitor.getMonitors).toHaveBeenCalled();
    expect(monitor.getMonitors).toHaveBeenCalledTimes(1);
});

// test('runs for a single monitor are returned', () => {
//     const req = getMockReq({
//         params: { id: 564 },
//         query: {limit: 10, offset: 2},
//         //body: { schedule: '* * * * *', command: 'date >> test.txt'},
//       });
// });

// test('a monitor can be added', () => {

// });

test('get a single monitor', async() => {
    const req = httpMocks.createRequest({
        params: {
            id: 1
        }
    });
    const res = httpMocks.createResponse();

    const monitorData = {
        id:1, 
        endpointKey:'2gVc5Eh2I6',
        command: 'test-job.sh',
        active: true,
        failing: false,
        created_at:  '2023-10-31 18:16:11.94086', 
        tolerable_runtime: 25,
        grace_period: 30,
        type: 'dual'
    }

    jest.spyOn(monitor, 'getMonitor').mockResolvedValue(monitorData);

    const mDBGetMonitorById = (req, res) => monitor.getMonitor(req, res);

    let result = await mDBGetMonitorById(req, res);

    expect(result).toBe(monitorData);
    expect(monitor.getMonitor).toHaveBeenCalled();
    expect(monitor.getMonitor).toHaveBeenCalledTimes(1);
});

test('a monitor can be deleted', async() => {
    const req = httpMocks.createRequest({
        params: {
            id: 13
        }
    });
    const res = httpMocks.createResponse();


    jest.spyOn(monitor, 'deleteMonitor');
    const mDBDeleteMonitor = (req, res) => monitor.deleteMonitor(req, res);

    await mDBDeleteMonitor(req, res);

    expect(res.statusCode).toEqual(204); //I'm getting a 200?
    expect(monitor.deleteMonitor).toHaveBeenCalled();
    expect(monitor.deleteMonitor).toHaveBeenCalledTimes(1);
});

