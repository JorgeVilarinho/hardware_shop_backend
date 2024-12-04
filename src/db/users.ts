import { User } from "models/user";
import { pool } from "./../db";

export const getUser = async (email: string): Promise<User | undefined> => {
  const query = {
    name: 'get-user-by-email',
    text: 'SELECT * FROM usuario WHERE email = $1;',
    values: [ email ]
  };

  const res = await pool.query(query);
  
  if(res.rowCount > 0) {
    const user: User = {
      id: res.rows[0].id,
      name: res.rows[0].name,
      email: res.rows[0].email,
      password: res.rows[0].password
    }

    return user;
  } 

  return undefined;
} 

export const createUser = async (name: string, email: string, password: string) => {
  const query = {
    name: 'crete-user',
    text: 'INSERT INTO usuario (name, email, password) VALUES ($1, $2, $3);',
    values: [ name, email, password ]
  };

  const res = await pool.query(query)
  return res.rowCount > 0;
}