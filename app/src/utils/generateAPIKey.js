import { nanoid } from 'nanoid';

const generateAPIKey = () => {
    const key = 'pfx_' + nanoid(); //pfx indicates that it's a key; default nanoid is 21 chars long
    return key;
}

export default generateAPIKey;
