import express from 'express';
import { CreateLeagueCommandHandler } from '../handlers/CreateLeagueCommandHandler';
import { CreateLeagueController } from '@controllers/create-league/CreateLeagueController';
import { LeagueRepository } from '@repositories/LeagueRepository';

const router = express.Router();
const leagueRepository = new LeagueRepository();
const leagueCommandHandler = new CreateLeagueCommandHandler(leagueRepository);
const createLeagueController = new CreateLeagueController(leagueCommandHandler);

router.post('/leagues', (req, res) => createLeagueController.createLeague(req, res));

export default router;
