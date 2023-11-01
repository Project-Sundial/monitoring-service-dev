import 'dotenv/config';
import pkg from 'pg';
import readSecretSync from '../utils/readSecretSync.js';
const { Pool } = pkg;

let pool;
const password = readSecretSync();

if (password) {
  const credentials = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: password,
    port: 5432,
  };

  pool = new Pool(credentials, { max: 20 });
  console.log('Pool initialized and ready for use.');
} else {
  console.log('Password is not available.');
}

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle database client.', err);
  client.release();
});

const dbQuery = (query, ...params) => {
  return pool.query(query, params);
};

export default dbQuery;

// const credentials = {
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: 'sundial',
//   password: process.env.PASSWORD,
//   port: 5432,
// };



// const pool = new Pool(credentials, { max: 20 } );