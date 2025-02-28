import { UpdateTeamNameCommandHandler } from '../UpdateTeamNameCommandHandler';
import { UpdateTeamNameCommand } from '@commands/UpdateTeamNameCommand';
import { TeamRepository } from '@repositories/TeamRepository';

describe('UpdateTeamNameCommandHandler', () => {
    let handler: UpdateTeamNameCommandHandler;
    let mockTeamRepository: jest.Mocked<TeamRepository>;

    beforeEach(() => {
        mockTeamRepository = {
            updateTeamName: jest.fn(),
        } as any;

        handler = new UpdateTeamNameCommandHandler(mockTeamRepository);
    });

    it('should update team name successfully', async () => {
        // Arrange
        const command = new UpdateTeamNameCommand('team-123', 'New Team Name');
        const expectedResult = {
            success: true,
            team: {
                id: 'team-123',
                name: 'New Team Name'
            }
        };
        mockTeamRepository.updateTeamName.mockResolvedValue(expectedResult);

        // Act
        const result = await handler.handle(command);

        // Assert
        expect(mockTeamRepository.updateTeamName).toHaveBeenCalledWith('team-123', 'New Team Name');
        expect(result).toEqual(expectedResult);
    });

    it('should throw error if team ID is missing', async () => {
        // Arrange
        const command = new UpdateTeamNameCommand('', 'New Team Name');

        // Act & Assert
        await expect(handler.handle(command))
            .rejects.toThrow('Team ID and new name are required');
        expect(mockTeamRepository.updateTeamName).not.toHaveBeenCalled();
    });

    it('should throw error if new name is missing', async () => {
        // Arrange
        const command = new UpdateTeamNameCommand('team-123', '');

        // Act & Assert
        await expect(handler.handle(command))
            .rejects.toThrow('Team ID and new name are required');
        expect(mockTeamRepository.updateTeamName).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
        // Arrange
        const command = new UpdateTeamNameCommand('team-123', 'New Team Name');
        mockTeamRepository.updateTeamName.mockRejectedValue(new Error('Database error'));

        // Act & Assert
        await expect(handler.handle(command))
            .rejects.toThrow('Database error');
    });
}); 