import {IsString, IsNotEmpty} from 'class-validator';

export class UpdateTeamNameInboundDto {
  @IsString()
  @IsNotEmpty({message: 'Team ID is required'})
  teamId: string;

  @IsString()
  @IsNotEmpty({message: 'The new name is required'})
  name: string;

  constructor(teamId: string, name: string) {
    this.teamId = teamId;
    this.name = name;
  }
}
