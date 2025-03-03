import express from 'express';
import {GetUserController} from '@controllers/get-user/GetUserController';
import {GetUserQueryHandler} from '@handlers/GetUserQueryHandler';
import {UserRepository} from '@repositories/UserRepository';

const router = express.Router();
const userRepository = new UserRepository();
const userQueryHandler = new GetUserQueryHandler(userRepository);
const userController = new GetUserController(userQueryHandler);

router.get('/users/:leagueId', (req, res, next) => {
  userController.getUsersByLeagueId(req, res).catch(next);
});

export default router;
