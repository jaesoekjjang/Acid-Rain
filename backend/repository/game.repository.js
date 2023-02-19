export class GameRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async save({ userId, score }) {
    try {
      const [row] = await this.pool.execute(
        `insert into game(user_id, score)
          values(?, ?)`,
        [userId, score]
      );
      return "" + row.insertId;
    } catch (err) {
      console.error(err);
    }
  }

  async getRanking(n) {
    try {
      const [rows] = await this.pool.query(
        `select g.score, u.name
          from game g 
            inner join user u
              on g.user_id = u.id
        where g.score > 0
        order by score desc 
        limit ${n}`
      );
      return rows;
    } catch (err) {
      console.error(err);
    }
  }
}
