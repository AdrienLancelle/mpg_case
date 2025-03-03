export class UpdateTeamNameCommand {
  constructor(
    public readonly teamId: string,
    public readonly name: string,
  ) {}
}
