import { CreateLeagueCommandHandler } from '../CreateLeagueCommandHandler';
import { LeagueRepository } from '@repositories/LeagueRepository';
import { CreateLeagueCommand } from '@commands/CreateLeagueCommand';

// Mock the LeagueRepository
jest.mock('@repositories/LeagueRepository');

describe('CreateLeagueCommandHandler', () => {
    let handler: CreateLeagueCommandHandler;
    let mockLeagueRepository: jest.Mocked<LeagueRepository>;

    beforeEach(() => {
        // Create a mock repository
        mockLeagueRepository = new LeagueRepository() as jest.Mocked<LeagueRepository>;
        handler = new CreateLeagueCommandHandler(mockLeagueRepository);
    });

    it('should create a league through the repository', async () => {
        // Arrange
        const command = new CreateLeagueCommand(
            'league-123',
            'Test League',
            'Test Description',
            'admin-123'
        );

        const expectedLeague = {
            id: 'league-123',
            name: 'Test League',
            description: 'Test Description',
            adminId: 'admin-123'
        };

        mockLeagueRepository.createLeague = jest.fn().mockResolvedValue(expectedLeague);

        // Act
        const result = await handler.handle(command);

        // Assert
        expect(mockLeagueRepository.createLeague).toHaveBeenCalledWith(command);
        expect(result).toEqual(expectedLeague);
    });

    it('should propagate errors from the repository', async () => {
        // Arrange
        const command = new CreateLeagueCommand(
            'league-123',
            'Test League',
            'Test Description',
            'admin-123'
        );

        const error = new Error('Database error');
        mockLeagueRepository.createLeague = jest.fn().mockRejectedValue(error);

        // Act & Assert
        await expect(handler.handle(command)).rejects.toThrow('Database error');
    });
}); 