const queryGetAllMonitors = 'SELECT * FROM monitor';

const queryAddMonitor = `
  INSERT INTO monitor (endpoint_key, schedule)
  VALUES ($1, $2)
  RETURNING *;
`;

export {
  queryGetAllMonitors,
  queryAddMonitor
};