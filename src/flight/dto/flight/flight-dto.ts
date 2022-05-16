import { IsNumber, IsString } from 'class-validator';

export class FlightDto {
  @IsNumber()
  flightId: number;

  @IsString()
  flightDate: string;

  @IsString()
  timeDeparture: string;

  @IsString()
  timeArrival: string;

  @IsString()
  locationDeparture: string;

  @IsString()
  locationArrival: string;
}
