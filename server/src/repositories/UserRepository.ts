import { getCollection } from '@dal/couchbaseClient';
import logger from '@logger';

export class UserRepository {
    async getUsersByLeagueId(leagueId: string) {
        try {
            const collection = await getCollection();
            const leagueResult = await collection.get(leagueId);
            const usersTeams = leagueResult.content.usersTeams;

            if (!usersTeams) {
                logger.info(`Retrieved 0 users for league: ${leagueId}`);
                return [];
            }

            const userIds = Object.keys(usersTeams);
            const users = await Promise.all(userIds.map(async (userId) => {
                const userResult = await collection.get(userId);
                return { name: userResult.content.name };
            }));

            logger.info(`Retrieved ${users.length} users for league: ${leagueId}`);
            return users;
        } catch (error) {
            logger.error('Error retrieving users:', error);
            return [];
        }
    }
}
