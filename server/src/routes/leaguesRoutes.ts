/**
 * @swagger
 * /api/leagues:
 *   post:
 *     summary: Créer une nouvelle league
 *     description: Ajoute un document de type mpg_league à la base de données
 *     tags:
 *       - Leagues
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - description
 *               - adminId
 *             properties:
 *               id:
 *                 type: string
 *                 description: Identifiant unique de la league
 *                 example: "league123"
 *               name:
 *                 type: string
 *                 description: Nom de la league
 *                 example: "Ligue des Champions"
 *               description:
 *                 type: string
 *                 description: Description détaillée de la league
 *                 example: "Compétition européenne de football de clubs"
 *               adminId:
 *                 type: string
 *                 description: Identifiant de l'administrateur de la league
 *                 example: "user456"
 *     responses:
 *       201:
 *         description: League créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identifiant de la league créée
 *                   example: "league123"
 *                 message:
 *                   type: string
 *                   example: "League créée avec succès"
 *       400:
 *         description: Requête invalide - données manquantes ou incorrectes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Les champs id, name, description et adminId sont requis"
 *       500:
 *         description: Erreur serveur lors de la création de la league
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la création de la league"
 */
import express from 'express';
import {CreateLeagueCommandHandler} from '../handlers/CreateLeagueCommandHandler';
import {CreateLeagueController} from '@controllers/create-league/CreateLeagueController';
import {LeagueRepository} from '@repositories/LeagueRepository';

const router = express.Router();
const leagueRepository = new LeagueRepository();
const leagueCommandHandler = new CreateLeagueCommandHandler(leagueRepository);
const createLeagueController = new CreateLeagueController(leagueCommandHandler);

router.post('/leagues', (req, res, next) => {
  createLeagueController.createLeague(req, res).catch(next);
});

export default router;
