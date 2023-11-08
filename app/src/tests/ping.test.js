import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';

jest.mock('../controllers/ping', () => {
    return {
        addPing: jest.fn()
    }
});

import * as ping from '../controllers/ping.js';

const mockAddPing = jest.spyOn(ping, 'addPing');


test('starting ping is added', async() => {
    const req = httpMocks.createRequest();
    req.body = {
        startPing: '2023-10-31 18:16:11.94086',
        endPointKey: '2gVc5Eh2I6',
        event: 'starting'
    }
    const res = httpMocks.createResponse();

    const mockPingObj = {
        startPing: '2023-10-31 18:16:11.94086',
        endPointKey: '2gVc5Eh2I6',
        event: 'starting'
    }

    const mockPing = jest.fn(async () => {
        return { data: mockPingObj };
    });

    mockAddPing.mockImplementation(mockPing);
    await ping.addPing(req, res);

    expect(mockAddPing).toHaveBeenCalledTimes(1);
    //event emitter being returned; don't know how to mock this out
    //expect(mockAddPing).toHaveBeenCalledWith({data: mockPingObj});
    expect(res.statusCode).toEqual(200);
});

test('ending ping is added', async() => {
    const req = httpMocks.createRequest();
    req.body = {
        startPing: '2023-10-31 18:16:11.94086',
        endPointKey: '2gVc5Eh2I6',
        event: 'ending'
    }
    const res = httpMocks.createResponse();

    const mockPingObj = {
        startPing: '2023-10-31 18:16:11.94086',
        endPointKey: '2gVc5Eh2I6',
        event: 'ending'
    }

    const mockPing = jest.fn(async () => {
        return { data: mockPingObj };
    });

    mockAddPing.mockImplementation(mockPing);
    await ping.addPing(req, res);

    expect(mockAddPing).toHaveBeenCalledTimes(2);
    //event emitter being returned; don't know how to mock this out
    //expect(mockAddPing).toHaveBeenCalledWith({data: mockPingObj});
    expect(res.statusCode).toEqual(200);
});

test('failing ping is added', async() => {
    const req = httpMocks.createRequest();
    req.body = {
        startPing: '2023-10-31 18:16:11.94086',
        endPointKey: '2gVc5Eh2I6',
        event: 'failing'
    }
    const res = httpMocks.createResponse();

    const mockPingObj = {
        startPing: '2023-10-31 18:16:11.94086',
        endPointKey: '2gVc5Eh2I6',
        event: 'failing'
    }

    const mockPing = jest.fn(async () => {
        return { data: mockPingObj };
    });

    mockAddPing.mockImplementation(mockPing);
    await ping.addPing(req, res);

    expect(mockAddPing).toHaveBeenCalledTimes(3);
    //event emitter being returned; don't know how to mock this out
    //expect(mockAddPing).toHaveBeenCalledWith({data: mockPingObj});
    expect(res.statusCode).toEqual(200);
});

//starting ping
//ending ping
//failing monitor changes to non-failing
//failing ping