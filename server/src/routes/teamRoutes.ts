import express from 'express';
import {UpdateTeamNameCommandHandler} from '../handlers/UpdateTeamNameCommandHandler';
import {TeamRepository} from '../repositories/TeamRepository';
import {UpdateTeamNameController} from '@controllers/update-team-name/UpdateTeamNameController';

const router = express.Router();
const teamRepository = new TeamRepository();
const updateTeamNameHandler = new UpdateTeamNameCommandHandler(teamRepository);
const updateTeamNameController = new UpdateTeamNameController(updateTeamNameHandler);

router.patch('/teams/:teamId/name', (req, res, next) => {
  updateTeamNameController.updateTeamName(req, res).catch(next);
});

export default router;
