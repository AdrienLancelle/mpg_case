export class CreateLeagueCommand {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly adminId: string
    ) { }
}
