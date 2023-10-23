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

const dbQuery = (query, ...params) => {
  return pool.query(query, params);
};

export default dbQuery;
