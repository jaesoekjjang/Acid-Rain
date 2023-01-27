import { mysqlPool } from "../app.js";
import { getConnection } from "../db.js";

export class UserService {
  constructor() {
    // this.userRepository = userRepository;
  }

  /**
   * @param {string} name
   * @returns {number} id
   */
  async findByName(name) {
    try {
      const [rows] = await mysqlPool.execute(
        `select * from user where name='${name}'`
      );
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  async create(name) {
    try {
      const [row] = await mysqlPool.execute(
        `insert into user(name) value('${name}')`
      );
      return "" + row.insertId;
    } catch (err) {
      console.error(err);
    }
  }
}
