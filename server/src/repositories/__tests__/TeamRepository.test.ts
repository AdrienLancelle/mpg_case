import { TeamRepository } from '../TeamRepository';
import { getCollection } from '@dal/couchbaseClient';
import logger from '@logger';

// Mock the couchbase client and logger
jest.mock('@dal/couchbaseClient');
jest.mock('@logger');

describe('TeamRepository', () => {
    let repository: TeamRepository;
    let mockCollection: jest.Mocked<any>;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mock collection
        mockCollection = {
            get: jest.fn(),
            upsert: jest.fn(),
        };

        (getCollection as jest.Mock).mockResolvedValue(mockCollection);
        repository = new TeamRepository();
    });

    describe('updateTeamName', () => {
        it('should update team name successfully', async () => {
            // Arrange
            const teamId = 'team-123';
            const newName = 'New Team Name';
            const existingTeam = {
                content: {
                    id: teamId,
                    name: 'Old Team Name'
                }
            };
            mockCollection.get.mockResolvedValue(existingTeam);
            mockCollection.upsert.mockResolvedValue({});

            // Act
            const result = await repository.updateTeamName(teamId, newName);

            // Assert
            expect(mockCollection.get).toHaveBeenCalledWith(teamId);
            expect(mockCollection.upsert).toHaveBeenCalledWith(
                teamId,
                expect.objectContaining({ name: newName })
            );
            expect(result).toEqual({
                success: true,
                team: expect.objectContaining({ name: newName })
            });
        });

        it('should throw error if team not found', async () => {
            // Arrange
            const teamId = 'non-existent-team';
            const newName = 'New Team Name';
            mockCollection.get.mockResolvedValue({ content: null });

            // Act & Assert
            await expect(repository.updateTeamName(teamId, newName))
                .rejects.toThrow('Impossible de mettre à jour le nom de l\'équipe');
            expect(mockCollection.upsert).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            // Arrange
            const teamId = 'team-123';
            const newName = 'New Team Name';
            const error = new Error('Database error');
            mockCollection.get.mockRejectedValue(error);

            // Act & Assert
            await expect(repository.updateTeamName(teamId, newName))
                .rejects.toThrow('Impossible de mettre à jour le nom de l\'équipe');
            expect(mockCollection.upsert).not.toHaveBeenCalled();
        });
    });
}); 