import pg from 'pg';

export const pool = new pg.Pool({
  user: 'ucha',
  password: 'ucha',
  host: '192.168.1.120',
  port: 5432,
  database: 'hardwareshop'
});