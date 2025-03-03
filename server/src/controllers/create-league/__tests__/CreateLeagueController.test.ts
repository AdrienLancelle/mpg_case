import {CreateLeagueController} from '../CreateLeagueController';
import {CreateLeagueCommandHandler} from '@handlers/CreateLeagueCommandHandler';
import {Request, Response} from 'express';
import {CreateLeagueCommand} from '@commands/CreateLeagueCommand';
import {CreateLeagueInboundDto} from '../dto/CreateLeagueInboundDto';
import {validate} from 'class-validator';

jest.mock('@handlers/CreateLeagueCommandHandler');
jest.mock('class-validator', () => ({
  validate: jest.fn(),
  IsString: jest.fn(),
  IsNotEmpty: jest.fn(),
}));

describe('CreateLeagueController', () => {
  let controller: CreateLeagueController;
  let mockCommandHandler: jest.Mocked<CreateLeagueCommandHandler>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockCommandHandler = new CreateLeagueCommandHandler(
      null,
    ) as jest.Mocked<CreateLeagueCommandHandler>;
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    mockRequest = {
      body: {
        id: 'league-123',
        name: 'Test League',
        description: 'Test Description',
        adminId: 'admin-123',
      },
    };

    controller = new CreateLeagueController(mockCommandHandler);
  });

  it('should create a league successfully', async () => {
    const expectedLeague = {
      id: 'league-123',
      name: 'Test League',
      description: 'Test Description',
      adminId: 'admin-123',
    };

    (validate as jest.Mock).mockResolvedValue([]);
    mockCommandHandler.handle.mockResolvedValue(expectedLeague);

    await controller.createLeague(mockRequest as Request, mockResponse as Response);

    expect(validate).toHaveBeenCalledWith(expect.any(CreateLeagueInboundDto));
    expect(mockCommandHandler.handle).toHaveBeenCalledWith(expect.any(CreateLeagueCommand));
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith(expectedLeague);
  });

  it('should return 400 if validation fails', async () => {
    (validate as jest.Mock).mockResolvedValue([
      {property: 'name', constraints: {isNotEmpty: 'name should not be empty'}},
    ]);

    await controller.createLeague(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({error: 'Invalid input', details: expect.any(Array)});
  });

  it('should handle unexpected errors', async () => {
    (validate as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    await controller.createLeague(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({error: 'Internal server error'});
  });
});
