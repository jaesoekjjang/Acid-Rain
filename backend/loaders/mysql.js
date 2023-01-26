import mysql from "mysql2";

export default async () => {
  const { HOST, USER, PASSWORD, DATABASE } = process.env;
  const pool = mysql.createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  });

  return pool;
};
