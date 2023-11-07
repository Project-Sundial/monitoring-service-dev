import { jest } from '@jest/globals';

jest.mock('../controllers/ping', () => {});

import * as ping from '../controllers/ping';
const mockAddPing = jest.spyOn(ping, 'addPing');

const mockPing = {
    startPing: '2023-10-31 18:16:11.94086',
    endPointKey: '2gVc5Eh2I6',
    event: 'starting'
}

test('starting ping is added', () => {

});

//starting ping
//ending ping
//failing monitor changes to non-failing
//failing ping