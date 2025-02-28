import { Request, Response } from 'express';
import { UpdateTeamNameCommandHandler } from '@handlers/UpdateTeamNameCommandHandler';
import { UpdateTeamNameCommand } from '@commands/UpdateTeamNameCommand';
import logger from '@logger';

export class UpdateTeamNameController {
    constructor(private readonly updateTeamNameHandler: UpdateTeamNameCommandHandler) { }

    async updateTeamName(req: Request, res: Response) {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Le nouveau nom est requis' });
        }

        try {
            const command = new UpdateTeamNameCommand(req.params.teamId, req.body.name);
            logger.info(`Updating team name for ID: ${req.params.teamId}`);

            await this.updateTeamNameHandler.handle(command);
            res.status(200).json({ message: 'Team name updated successfully' });
        } catch (error) {
            logger.error('Error updating team name:', error);
            res.status(500).json({ error: 'Impossible de mettre à jour le nom de l\'équipe' });
        }
    }
}
