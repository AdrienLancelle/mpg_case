import request from 'supertest';
import express, { Application } from 'express';
import { GetUserQueryHandler } from '@handlers/GetUserQueryHandler';
import logger from '@logger';
import { GetUserController } from '../GetUserController';

// Mock dependencies
jest.mock('@logger');
const mockHandler: jest.Mocked<GetUserQueryHandler> = {
    handle: jest.fn(),
} as any;

const app: Application = express();
app.use(express.json());

const controller = new GetUserController(mockHandler);
app.get('/api/leagues/:leagueId/users', (req, res) => controller.getUsersByLeagueId(req, res));

describe('GetUserController', () => {
    const leagueId = 'league_123';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get users successfully', async () => {
        // Arrange
        const expectedUsers = [
            { name: 'User One' },
            { name: 'User Two' }
        ];
        mockHandler.handle.mockResolvedValueOnce(expectedUsers);

        // Act
        const response = await request(app)
            .get(`/api/leagues/${leagueId}/users`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ users: expectedUsers });
        expect(mockHandler.handle).toHaveBeenCalledWith(
            expect.objectContaining({ leagueId })
        );
        expect(logger.info).toHaveBeenCalledWith(`Fetching users for league ID: ${leagueId}`);
    });

    it('should return empty array when no users found', async () => {
        // Arrange
        mockHandler.handle.mockResolvedValueOnce([]);

        // Act
        const response = await request(app)
            .get(`/api/leagues/${leagueId}/users`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ users: [] });
        expect(mockHandler.handle).toHaveBeenCalledWith(
            expect.objectContaining({ leagueId })
        );
    });

    it('should return 500 on handler error', async () => {
        // Arrange
        mockHandler.handle.mockRejectedValueOnce(new Error('Database error'));

        // Act
        const response = await request(app)
            .get(`/api/leagues/${leagueId}/users`);

        // Assert
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Impossible de récupérer les utilisateurs');
        expect(logger.error).toHaveBeenCalledWith(
            'Error fetching users:',
            expect.any(Error)
        );
    });
}); 