import {CreateLeagueCommand} from '@commands/CreateLeagueCommand';
import {LeagueRepository} from '@repositories/LeagueRepository';

export class CreateLeagueCommandHandler {
  constructor(private readonly leagueRepository: LeagueRepository) {}

  async handle(command: CreateLeagueCommand) {
    return this.leagueRepository.createLeague(command);
  }
}
