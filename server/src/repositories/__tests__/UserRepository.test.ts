import { UserRepository } from '../UserRepository';
import { getCollection } from '@dal/couchbaseClient';
import logger from '@logger';

// Mock the couchbase client and logger
jest.mock('@dal/couchbaseClient');
jest.mock('@logger');

describe('UserRepository', () => {
    let repository: UserRepository;
    let mockCollection: jest.Mocked<any>;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mock collection
        mockCollection = {
            get: jest.fn(),
        };

        (getCollection as jest.Mock).mockResolvedValue(mockCollection);
        repository = new UserRepository();
    });

    describe('getUsersByLeagueId', () => {
        it('should return users for a league', async () => {
            // Arrange
            const leagueId = 'league-123';
            const usersTeams = {
                'user-1': ['team-1'],
                'user-2': ['team-2']
            };
            const leagueData = {
                content: {
                    id: leagueId,
                    usersTeams
                }
            };
            const userData1 = {
                content: {
                    id: 'user-1',
                    name: 'User One'
                }
            };
            const userData2 = {
                content: {
                    id: 'user-2',
                    name: 'User Two'
                }
            };

            mockCollection.get
                .mockResolvedValueOnce(leagueData)
                .mockResolvedValueOnce(userData1)
                .mockResolvedValueOnce(userData2);

            // Act
            const result = await repository.getUsersByLeagueId(leagueId);

            // Assert
            expect(mockCollection.get).toHaveBeenCalledWith(leagueId);
            expect(mockCollection.get).toHaveBeenCalledWith('user-1');
            expect(mockCollection.get).toHaveBeenCalledWith('user-2');
            expect(result).toEqual([
                { name: 'User One' },
                { name: 'User Two' }
            ]);
            expect(logger.info).toHaveBeenCalledWith(
                `Retrieved ${result.length} users for league: ${leagueId}`
            );
        });

        it('should return empty array if league has no users', async () => {
            // Arrange
            const leagueId = 'league-123';
            const leagueData = {
                content: {
                    id: leagueId,
                    usersTeams: {}
                }
            };
            mockCollection.get.mockResolvedValue(leagueData);

            // Act
            const result = await repository.getUsersByLeagueId(leagueId);

            // Assert
            expect(result).toEqual([]);
            expect(logger.info).toHaveBeenCalledWith(
                `Retrieved 0 users for league: ${leagueId}`
            );
        });

        it('should return empty array if league not found', async () => {
            // Arrange
            const leagueId = 'non-existent-league';
            mockCollection.get.mockRejectedValue(new Error('League not found'));

            // Act
            const result = await repository.getUsersByLeagueId(leagueId);

            // Assert
            expect(result).toEqual([]);
            expect(logger.error).toHaveBeenCalledWith(
                'Error retrieving users:',
                expect.any(Error)
            );
        });

        it('should return empty array if usersTeams is null', async () => {
            // Arrange
            const leagueId = 'league-123';
            const leagueData = {
                content: {
                    id: leagueId,
                    usersTeams: null
                }
            };
            mockCollection.get.mockResolvedValue(leagueData);

            // Act
            const result = await repository.getUsersByLeagueId(leagueId);

            // Assert
            expect(result).toEqual([]);
            expect(logger.info).toHaveBeenCalledWith(
                `Retrieved 0 users for league: ${leagueId}`
            );
        });
    });
}); 