import { Request, Response } from 'express';
import { GetUserQueryHandler } from '@handlers/GetUserQueryHandler';
import logger from '@logger';
import { GetUsersByLeagueIdQuery } from '../../queries/GetUsersByLeagueIDQuery';

export class GetUserController {
    constructor(private readonly userQueryHandler: GetUserQueryHandler) { }

    /**
     * @swagger
     * /api/leagues/{leagueId}/users:
     *   get:
     *     summary: Get all users in a league
     *     description: Retrieves a list of users that belong to the specified league
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: leagueId
     *         required: true
     *         description: ID of the league to get users from
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of users retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 users:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       name:
     *                         type: string
     *                         example: "John Doe"
     *       500:
     *         description: Server error while retrieving users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Impossible de récupérer les utilisateurs"
     */
    async getUsersByLeagueId(req: Request, res: Response) {
        try {
            const query = new GetUsersByLeagueIdQuery(req.params.leagueId);
            logger.info(`Fetching users for league ID: ${req.params.leagueId}`);

            const users = await this.userQueryHandler.handle(query);
            res.json({ users });
        } catch (error) {
            logger.error('Error fetching users:', error);
            res.status(500).json({ error: 'Impossible de récupérer les utilisateurs' });
        }
    }
}
