import {LeagueRepository} from '../LeagueRepository';
import {CreateLeagueCommand} from '@commands/CreateLeagueCommand';
import {getCollection} from '@dal/couchbaseClient';
import logger from '@logger';

// Mock the couchbase client and logger
jest.mock('@dal/couchbaseClient');
jest.mock('@logger');

describe('LeagueRepository', () => {
  let repository: LeagueRepository;
  let mockCollection: jest.Mocked<any>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock collection
    mockCollection = {
      insert: jest.fn(),
      get: jest.fn(),
      upsert: jest.fn(),
    };

    (getCollection as jest.Mock).mockResolvedValue(mockCollection);
    repository = new LeagueRepository();
  });

  describe('createLeague', () => {
    it('should create a league successfully', async () => {
      // Arrange
      const command = new CreateLeagueCommand(
        'league-123',
        'Test League',
        'Test Description',
        'admin-123',
      );
      mockCollection.insert.mockResolvedValue({});

      // Act
      const result = await repository.createLeague(command);

      // Assert
      expect(getCollection).toHaveBeenCalled();
      expect(mockCollection.insert).toHaveBeenCalledWith(command.id, command);
      expect(result).toEqual(command);
      expect(logger.info).toHaveBeenCalledWith(
        `League created successfully with ID: ${command.id}`,
      );
    });

    it('should handle database errors', async () => {
      // Arrange
      const command = new CreateLeagueCommand(
        'league-123',
        'Test League',
        'Test Description',
        'admin-123',
      );
      const error = new Error('Database error');
      mockCollection.insert.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.createLeague(command)).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalledWith('Error creating league:', error);
    });
  });

  describe('updateTeamName', () => {
    it('should update team name successfully', async () => {
      // Arrange
      const command = {
        teamId: 'team-123',
        name: 'New Team Name',
      };
      const existingTeam = {
        content: {
          id: 'team-123',
          name: 'Old Team Name',
        },
      };
      mockCollection.get.mockResolvedValue(existingTeam);
      mockCollection.upsert.mockResolvedValue({});

      // Act
      const result = await repository.updateTeamName(command);

      // Assert
      expect(mockCollection.get).toHaveBeenCalledWith(command.teamId);
      expect(mockCollection.upsert).toHaveBeenCalledWith(
        command.teamId,
        expect.objectContaining({name: command.name}),
      );
      expect(logger.info).toHaveBeenCalledWith(
        `Team name updated successfully for ID: ${command.teamId}`,
      );
      expect(result).toBe(existingTeam.content);
    });

    it('should handle database errors during team update', async () => {
      // Arrange
      const command = {
        teamId: 'team-123',
        name: 'New Team Name',
      };
      const error = new Error('Database error');
      mockCollection.get.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.updateTeamName(command)).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalledWith('Error updating team name:', error);
    });
  });
});
