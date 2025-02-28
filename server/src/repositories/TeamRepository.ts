import { getCollection } from '@dal/couchbaseClient';
import logger from '@logger';

export class TeamRepository {
    async updateTeamName(teamId: string, newName: string) {
        try {
            const collection = await getCollection();
            const teamResult = await collection.get(teamId);
            const teamData = teamResult.content;

            if (!teamData) {
                throw new Error('Équipe non trouvée');
            }

            teamData.name = newName;
            await collection.upsert(teamId, teamData);

            logger.info(`Team name updated successfully for ID: ${teamId}`);
            return { success: true, team: teamData };
        } catch (error) {
            logger.error('Error updating team name:', error);
            throw new Error('Impossible de mettre à jour le nom de l\'équipe');
        }
    }

}
