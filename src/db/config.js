import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const credentials = {
  user: process.env.USER,
  host: process.env.HOST,
  database: 'sundial',
  password: process.env.PASSWORD,
  port: 5432,
};

const pool = new Pool(credentials, { max: 20 } );

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle database client.', err);
  client.release();
});

const dbQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

export default dbQuery;

