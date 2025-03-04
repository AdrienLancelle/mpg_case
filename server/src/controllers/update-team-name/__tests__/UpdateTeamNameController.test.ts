import {UpdateTeamNameController} from '../UpdateTeamNameController';
import {UpdateTeamNameCommandHandler} from '@handlers/UpdateTeamNameCommandHandler';
import {Request, Response} from 'express';
import logger from '@logger';

jest.mock('@logger');

describe('UpdateTeamNameController', () => {
  let controller: UpdateTeamNameController;
  let mockHandler: jest.Mocked<UpdateTeamNameCommandHandler>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({json: mockJson});
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    mockHandler = {
      handle: jest.fn(),
    } as any;

    controller = new UpdateTeamNameController(mockHandler);
  });

  it('should update team name successfully', async () => {
    // Arrange
    mockRequest = {
      params: {teamId: 'team-123'},
      body: {name: 'New Team Name'},
    };
    mockHandler.handle.mockResolvedValue(undefined);

    // Act
    await controller.updateTeamName(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockHandler.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: 'team-123',
        name: 'New Team Name',
      }),
    );
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({message: 'Team name updated successfully'});
    expect(logger.info).toHaveBeenCalledWith('Updating team name for ID: team-123');
  });

  it('should return 400 if name is missing', async () => {
    // Arrange
    mockRequest = {
      params: {teamId: 'team-123'},
      body: {}, // No name provided
    };

    // Act
    await controller.updateTeamName(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid input',
        details: expect.any(Array), // Validation errors
      }),
    );
    expect(mockHandler.handle).not.toHaveBeenCalled();
  });

  it('should return 500 on handler error', async () => {
    // Arrange
    mockRequest = {
      params: {teamId: 'team-123'},
      body: {name: 'New Team Name'},
    };
    mockHandler.handle.mockRejectedValue(new Error('Database error'));

    // Act
    await controller.updateTeamName(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({error: 'Unable to update the team name'});
    expect(logger.error).toHaveBeenCalledWith('Error updating team name:', expect.any(Error));
  });
});
