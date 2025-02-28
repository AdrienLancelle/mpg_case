import { UpdateTeamNameCommand } from '@commands/UpdateTeamNameCommand';
import { TeamRepository } from '@repositories/TeamRepository';

export class UpdateTeamNameCommandHandler {
    constructor(private readonly teamRepository: TeamRepository) { }

    async handle(command: UpdateTeamNameCommand) {
        if (!command.teamId || !command.newName) {
            throw new Error('Team ID and new name are required');
        }

        return await this.teamRepository.updateTeamName(command.teamId, command.newName);
    }
}
