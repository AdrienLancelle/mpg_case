import {IsString, IsNotEmpty} from 'class-validator';

export class GetUsersByLeagueIdInboundDto {
  @IsString()
  @IsNotEmpty({message: 'League ID is required'})
  leagueId: string;

  constructor(leagueId: string) {
    this.leagueId = leagueId;
  }
}
