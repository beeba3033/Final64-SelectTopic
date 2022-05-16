import { IsNumber, IsString } from 'class-validator';

export class BookingDto {
  @IsNumber()
  flightId: number;

  @IsNumber()
  seatId: number;

  @IsNumber()
  bookingId: number;

  @IsString()
  dateDeparture: string;

  @IsString()
  passengerName: string;

  @IsString()
  passengerSurname: string;

  @IsNumber()
  adults: number;

  @IsNumber()
  children: number;

  @IsNumber()
  infants: number;
}
