import { IsNumber, IsString } from 'class-validator';

export class SeatDto {
  @IsNumber()
  seatId: number;

  @IsNumber()
  flightId: number;

  @IsString()
  seatNumber: string;
}
