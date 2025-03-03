import {getCollection} from '@dal/couchbaseClient';
import {CreateLeagueCommand} from '@commands/CreateLeagueCommand';
import {UpdateTeamNameCommand} from '@commands/UpdateTeamNameCommand';
import logger from '../logger/logger';

export class LeagueRepository {
  async createLeague(command: CreateLeagueCommand) {
    try {
      const collection = await getCollection();
      await collection.insert(command.id, command);
      logger.info(`League created successfully with ID: ${command.id}`);
      return command;
    } catch (error) {
      logger.error('Error creating league:', error);
      throw error;
    }
  }

  async updateTeamName(command: UpdateTeamNameCommand) {
    try {
      const collection = await getCollection();
      const teamResult = await collection.get(command.teamId);
      teamResult.content.name = command.name;
      await collection.upsert(command.teamId, teamResult.content);
      logger.info(`Team name updated successfully for ID: ${command.teamId}`);
      return teamResult.content;
    } catch (error) {
      logger.error('Error updating team name:', error);
      throw error;
    }
  }
}
