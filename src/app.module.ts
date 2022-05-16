import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightModule } from './flight/flight.module';

//Entity
import { FlightEntity } from './flight/entity/flight/flight.entity';
import { SeatEntity } from './flight/entity/seat/seat.entity';
import { BookingEntity } from './flight/entity/booking/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/booking-flight.db',
      entities: [FlightEntity, SeatEntity, BookingEntity],
      synchronize: true,
    }),
    FlightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
