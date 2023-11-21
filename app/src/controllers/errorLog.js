import { dbUpdateRunErrorLog } from '../db/queries.js';

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
    res.json(run);
  } catch (error) {
    next(error);
  }
};

export {
  updateRunErrorLog
};