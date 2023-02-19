import { UserRepository } from "../repository/user.repository.js";

export class UserService {
  /**
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @param {string} name
   * @returns {{id: number, name: string}} User
   */
  async findByName(name) {
    return await this.userRepository.findByName(name);
  }

  /**
   * @param {string} name
   * @returns {number} id
   */
  async create(name) {
    return this.userRepository.create(name);
  }
}
