import { mysqlPool } from "../app.js";

export class GameService {
  constructor() {
    // this.gameRepository = gameRepository;
  }

  async save({ userId, score }) {
    try {
      const [row] = await mysqlPool.execute(
        `insert into game(user_id, score) values(${userId}, ${score})`
      );
      return "" + row.insertId;
    } catch (err) {
      console.error(err);
    }
    // await this.gameRepository.create(game);
  }

  async getRanking(n = 100) {
    try {
      const [rows] = await mysqlPool.execute(
        `select * from game order by score limit=${n}'`
      );
      return rows;
    } catch (err) {
      console.error(err);
    }
    // return await this.gameRepository.getTopRanks(n);
  }

  // {userId, score}
}
