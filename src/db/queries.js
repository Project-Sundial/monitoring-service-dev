import executeQuery from './config.js';

const getOverdue = async () => {
  const GET_OVERDUE = 'SELECT * FROM monitor WHERE '
    + 'next_expected_at < $1';
  const result = await executeQuery(GET_OVERDUE, new Date());

  return result;
};

export default {
  getOverdue,
};
