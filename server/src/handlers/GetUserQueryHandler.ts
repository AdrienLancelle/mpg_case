import {GetUsersByLeagueIdQuery} from '../queries/GetUsersByLeagueIDQuery';
import {UserRepository} from '@repositories/UserRepository';

export class GetUserQueryHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUsersByLeagueIdQuery) {
    return this.userRepository.getUsersByLeagueId(query.leagueId);
  }
}
