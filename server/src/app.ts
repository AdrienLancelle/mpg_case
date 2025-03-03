import express from 'express';
import userRoutes from './routes/userRoutes';
import leagueRoutes from './routes/leaguesRoutes';
import teamRoutes from './routes/teamRoutes';
import {setupSwagger} from 'config/swagger';
import logger from '@logger';

const app = express();
const port = process.env.APP_PORT;

app.use(express.json());

setupSwagger(app);

app.use('/api', userRoutes);
app.use('/api', leagueRoutes);
app.use('/api', teamRoutes);

app.listen(port, () => {
  logger.info(`Express écoute sur http://localhost:${port}`);
});
