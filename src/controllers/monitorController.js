import dbQuery from '../db/config.js';
import queryGetAllMonitors from '../db/queries/getAllMonitors.js';

const getMonitors = async (req, res) => {
  try {
    const monitors = await dbQuery(queryGetAllMonitors);
    res.json(monitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch monitors.' });
  }
};

export default getMonitors;