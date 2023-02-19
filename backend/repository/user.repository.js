export class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findByName(name) {
    try {
      const [rows] = await this.pool.execute(
        `select * from user where name=?`,
        [name]
      );

      return rows.length ? rows[0] : { id: -1, name: "" };
    } catch (err) {
      console.error(err);
    }
  }

  async create(name) {
    try {
      const [row] = await this.pool.execute(`insert into user(name) value(?)`, [
        name,
      ]);
      return row.insertId;
    } catch (err) {
      console.error(err);
    }
  }
}
