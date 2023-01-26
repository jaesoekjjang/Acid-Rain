class GameService {
  constructor({ gameRepository }) {
    this.gameRepository = gameRepository;
  }

  async getTopRanks(n) {
    return await this.gameRepository.getTopRanks(n);
  }

  // {userId, score}
  async create(game) {
    await this.gameRepository.create(game);
  }
}
