import {Request, Response} from 'express';
import {GetUserQueryHandler} from '@handlers/GetUserQueryHandler';
import logger from '@logger';
import {GetUsersByLeagueIdQuery} from '../../queries/GetUsersByLeagueIDQuery';
import {GetUsersByLeagueIdInboundDto} from './dto/GetUsersByLEagueIdInboundDto';

export class GetUserController {
  constructor(private readonly userQueryHandler: GetUserQueryHandler) {}

  async getUsersByLeagueId(req: Request, res: Response) {
    try {
      const dto = new GetUsersByLeagueIdInboundDto(req.params.leagueId);
      const query = new GetUsersByLeagueIdQuery(dto.leagueId);

      logger.info(`Fetching users for league ID: ${dto.leagueId}`);
      const users = await this.userQueryHandler.handle(query);

      res.status(200).json({users});
    } catch (error) {
      logger.error('Error fetching users:', error);
      res.status(500).json({error: 'Impossible de récupérer les utilisateurs'}); // <-- Correction ici
    }
  }
}
