import {IsString, IsNotEmpty} from 'class-validator';

export class CreateLeagueInboundDto {
  @IsString()
  @IsNotEmpty({message: 'League ID is required'})
  id: string;

  @IsString()
  @IsNotEmpty({message: 'League name is required'})
  name: string;

  @IsString()
  @IsNotEmpty({message: 'Admin ID is required'})
  adminId: string;

  @IsString()
  description?: string; // Optionnel

  constructor(id: string, name: string, adminId: string, description?: string) {
    this.id = id;
    this.name = name;
    this.adminId = adminId;
    this.description = description;
  }
}
