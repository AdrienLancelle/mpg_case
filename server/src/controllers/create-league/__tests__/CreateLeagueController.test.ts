import { CreateLeagueController } from '../CreateLeagueController';
import { CreateLeagueCommandHandler } from '@handlers/CreateLeagueCommandHandler';
import { Request, Response } from 'express';
import { CreateLeagueCommand } from '@commands/CreateLeagueCommand';

// Mock the CommandHandler
jest.mock('@handlers/CreateLeagueCommandHandler');

describe('CreateLeagueController', () => {
    let controller: CreateLeagueController;
    let mockCommandHandler: jest.Mocked<CreateLeagueCommandHandler>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;

    beforeEach(() => {
        // Reset all mocks
        mockCommandHandler = new CreateLeagueCommandHandler(null) as jest.Mocked<CreateLeagueCommandHandler>;
        
        // Setup response mock methods
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockSend = jest.fn();
        
        mockResponse = {
            status: mockStatus,
            json: mockJson,
            send: mockSend,
        };

        // Setup request mock
        mockRequest = {
            body: {
                id: 'league-123',
                name: 'Test League',
                description: 'Test Description',
                adminId: 'admin-123'
            }
        };

        controller = new CreateLeagueController(mockCommandHandler);
    });

    it('should create a league successfully', async () => {
        // Arrange
        const expectedLeague = {
            id: 'league-123',
            name: 'Test League',
            description: 'Test Description',
            adminId: 'admin-123'
        };
        
        mockCommandHandler.handle = jest.fn().mockResolvedValue(expectedLeague);

        // Act
        await controller.createLeague(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockCommandHandler.handle).toHaveBeenCalledWith(
            expect.any(CreateLeagueCommand)
        );
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(expectedLeague);
    });

    it('should handle errors appropriately', async () => {
        // Arrange
        mockCommandHandler.handle = jest.fn().mockRejectedValue(new Error('Database error'));

        // Act
        await controller.createLeague(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockSend).toHaveBeenCalledWith('Erreur lors de la création de la ligue');
    });

    it('should pass correct command data to handler', async () => {
        // Arrange
        mockCommandHandler.handle = jest.fn().mockResolvedValue({});

        // Act
        await controller.createLeague(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockCommandHandler.handle).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'league-123',
                name: 'Test League',
                description: 'Test Description',
                adminId: 'admin-123'
            })
        );
    });
}); 