import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'ayanbatulan',
  host: 'localhost',
  database: 'ticket_system',
  password: 'admin1234',
  port: 5001,
});

// pool.query("SELECT NOW()").then((res) => console.log(res.rows)).catch(console.error);

export default pool;
