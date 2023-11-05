import { useState, useEffect } from 'react';
import { getAPIKeys, addAPIKey, addAPIKeyName } from '../services/keys';

const APIKeyList = (onError) => {
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const list = await getAPIKeys();
                setKeys(list);
            } catch(error) {
                onError(error);
            }
        };
        fetchList();
    }, []);
};

export default APIKeyList;