import {Request, Response} from 'express';
import {CreateLeagueCommandHandler} from '../../handlers/CreateLeagueCommandHandler';
import {CreateLeagueCommand} from '../../commands/CreateLeagueCommand';
import {CreateLeagueInboundDto} from './dto/CreateLeagueInboundDto';
import {validate} from 'class-validator';
import logger from '@logger';

export class CreateLeagueController {
  constructor(private readonly leagueCommandHandler: CreateLeagueCommandHandler) {}

  async createLeague(req: Request, res: Response) {
    try {
      const dto = new CreateLeagueInboundDto(
        req.body.id,
        req.body.name,
        req.body.adminId,
        req.body.description,
      );
      const errors = await validate(dto);

      if (errors.length > 0) {
        logger.error('Error creating league:', errors);
        return res.status(400).json({error: 'Invalid input', details: errors});
      }
      const command = new CreateLeagueCommand(dto.id, dto.name, dto.description, dto.adminId);
      const newLeague = await this.leagueCommandHandler.handle(command);
      res.status(201).json(newLeague);
    } catch (error) {
      logger.error('Error creating league:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }
}
