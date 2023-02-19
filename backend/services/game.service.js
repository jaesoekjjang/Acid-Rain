export class GameService {
  constructor(userService, gameRepository) {
    this.userService = userService;
    this.gameRepository = gameRepository;
  }

  async saveByUserName({ userName, score }) {
    let { id: userId } = await this.userService.findByName(userName);

    if (userId === -1) {
      userId = await this.userService.create(userName);
    }

    return await this.gameRepository.save({ userId, score });
  }

  //! limit에 prepared statement 사용 불가
  async getRanking(n = 100) {
    return await this.gameRepository.getRanking(n);
  }
}
