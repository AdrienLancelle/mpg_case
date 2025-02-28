import express from 'express';
import userRoutes from './routes/userRoutes';
import leagueRoutes from './routes/leaguesRoutes';
import teamRoutes from './routes/teamRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', leagueRoutes);
app.use('/api', teamRoutes);

app.listen(port, () => {
    console.log(`Express écoute sur http://localhost:${port}`);
});
