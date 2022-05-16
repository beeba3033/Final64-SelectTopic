import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightControlController } from './controller/flight-control/flight-control.controller';
import { FlightService } from './service/flight/flight.service';

//Entity
import { FlightEntity } from './entity/flight/flight.entity';
import { SeatEntity } from './entity/seat/seat.entity';
import { BookingEntity } from './entity/booking/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlightEntity]),
    TypeOrmModule.forFeature([SeatEntity]),
    TypeOrmModule.forFeature([BookingEntity]),
  ],
  controllers: [FlightControlController],
  providers: [FlightService],
})
export class FlightModule {}
