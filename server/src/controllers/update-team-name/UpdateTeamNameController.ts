import {Request, Response} from 'express';
import {validate} from 'class-validator';
import {UpdateTeamNameCommandHandler} from '@handlers/UpdateTeamNameCommandHandler';
import {UpdateTeamNameCommand} from '@commands/UpdateTeamNameCommand';
import {UpdateTeamNameInboundDto} from './dto/UpdateTeamNameInboundDto';
import logger from '@logger';

export class UpdateTeamNameController {
  constructor(private readonly updateTeamNameHandler: UpdateTeamNameCommandHandler) {}

  async updateTeamName(req: Request, res: Response) {
    try {
      const dto = new UpdateTeamNameInboundDto(req.params.teamId, req.body.name);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({error: 'Invalid input', details: errors});
      }

      const command = new UpdateTeamNameCommand(dto.teamId, dto.name);
      logger.info(`Updating team name for ID: ${dto.teamId}`);

      await this.updateTeamNameHandler.handle(command);
      res.status(200).json({message: 'Team name updated successfully'});
    } catch (error) {
      logger.error('Error updating team name:', error);
      res.status(500).json({error: 'Unable to update the team name'});
    }
  }
}
