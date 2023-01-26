import { mysqlPool as pool } from "./app.js";

export function getConnection(cb) {
  pool.getConnection((err, connection) => {
    if (err) throw Error("mysql connection error");
    cb(connection);
    connection.release();
  });
}
