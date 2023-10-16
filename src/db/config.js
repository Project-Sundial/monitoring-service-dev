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

const pool = new Pool(credentials);

const executeQuery = async (query) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export default executeQuery;

