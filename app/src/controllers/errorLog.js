import { dbUpdateRunErrorLog } from '../db/queries.js';
import { sendUpdatedRun } from './sse.js';

const updateRunErrorLog = async (req, res, next) => {
  try {
    const run_token = req.body.runToken;
    const error_log = req.body.logContent;
    const run = await dbUpdateRunErrorLog({ error_log, run_token });

    if (!run) {
      const error = Error('Unable to find run associated with that run token.');
      error.statusCode = 404;
      throw error;
    }

    sendUpdatedRun(run);
    res.json(run);
  } catch (error) {
    next(error);
  }
};

export {
  updateRunErrorLog
};