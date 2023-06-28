import type { Pool } from 'pg';
import pg from 'pg';

const env = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
};

let _pool: Pool | undefined;

const start = async () => {
  _pool = new pg.Pool({
    host: env.host,
    port: +env.port,
    database: env.database,
    user: env.user,
    password: env.password,
  });

  global.Postgres = {
    pool: _pool,
  };
};

const destroy = () => {
  console.log('Postgres destroying...');
  if (_pool) {
    _pool.end();
    _pool = undefined;
  }
  console.log('Postgres destroyed');
};

export { destroy, start };
