import { Request, Response } from 'express';
import { CreateLeagueCommandHandler } from '../../handlers/CreateLeagueCommandHandler';
import { CreateLeagueCommand } from '../../commands/CreateLeagueCommand';

export class CreateLeagueController {
    constructor(private readonly leagueCommandHandler: CreateLeagueCommandHandler) { }

    async createLeague(req: Request, res: Response) {
        try {
            const command = new CreateLeagueCommand(
                req.body.id,
                req.body.name,
                req.body.description,
                req.body.adminId
            );
            const newLeague = await this.leagueCommandHandler.handle(command);
            res.status(201).json(newLeague);
        } catch (error) {
            res.status(500).send('Erreur lors de la création de la ligue');
        }
    }
}
