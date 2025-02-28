import { GetUsersByLeagueIdQuery } from '../../queries/GetUsersByLeagueIDQuery';
import { GetUserQueryHandler } from '../GetUserQueryHandler';
import { UserRepository } from '@repositories/UserRepository';

describe('GetUserQueryHandler', () => {
    let handler: GetUserQueryHandler;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            getUsersByLeagueId: jest.fn(),
        } as any;

        handler = new GetUserQueryHandler(mockUserRepository);
    });

    it('should get users by league ID', async () => {
        // Arrange
        const query = new GetUsersByLeagueIdQuery('league-123');
        const expectedUsers = [
            { name: 'User One' },
            { name: 'User Two' }
        ];
        mockUserRepository.getUsersByLeagueId.mockResolvedValue(expectedUsers);

        // Act
        const result = await handler.handle(query);

        // Assert
        expect(mockUserRepository.getUsersByLeagueId).toHaveBeenCalledWith('league-123');
        expect(result).toEqual(expectedUsers);
    });

    it('should return empty array when no users found', async () => {
        // Arrange
        const query = new GetUsersByLeagueIdQuery('league-123');
        mockUserRepository.getUsersByLeagueId.mockResolvedValue([]);

        // Act
        const result = await handler.handle(query);

        // Assert
        expect(mockUserRepository.getUsersByLeagueId).toHaveBeenCalledWith('league-123');
        expect(result).toEqual([]);
    });
}); 