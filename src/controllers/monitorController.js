import dbQuery from '../db/config.js';
import queryGetAllMonitors from '../db/queries.js';

const getMonitors = async (req, res) => {
  try {
    const response = await dbQuery(queryGetAllMonitors);
    const monitors = response.rows;
    res.json(monitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch monitors.' });
  }
};

export default getMonitors;