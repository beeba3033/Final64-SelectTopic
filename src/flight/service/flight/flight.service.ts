import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDto } from 'src/flight/dto/booking/booking-dto';
import { FlightDto } from 'src/flight/dto/flight/flight-dto';
import { SeatDto } from 'src/flight/dto/seat/seat-dto';
import { BookingEntity } from 'src/flight/entity/booking/booking.entity';
import { FlightEntity } from 'src/flight/entity/flight/flight.entity';
import { SeatEntity } from 'src/flight/entity/seat/seat.entity';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class FlightService {
  entityManager = getManager();
  constructor(
    @InjectRepository(FlightEntity)
    private flightRepository: Repository<FlightEntity>,

    @InjectRepository(SeatEntity)
    private seatRepository: Repository<SeatEntity>,

    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
  ) {}

  //
  //Flight Function
  createFlight(_flight: FlightDto): Promise<FlightDto> {
    return this.flightRepository.save(_flight);
  }

  getFlights(): Promise<FlightDto[]> {
    return this.flightRepository.find();
  }

  async selectFlights(
    locationDeparture,
    locationArrival,
    flightDate,
  ): Promise<FlightDto[]> {
    return this.entityManager.query(
      'SELECT * FROM `flight_entity` WHERE locationDeparture = $1 and locationArrival = $2 and flightDate = $3;',
      [locationDeparture, locationArrival, flightDate],
    );
  }

  async searchFlights(_flightId: number): Promise<FlightDto> {
    console.log('Search!');
    try {
      return await this.flightRepository.findOne({ flightId: _flightId });
    } catch (error) {
      return error;
    }
  }

  async validateFlights(
    _flightId: number,
    _dateDeparture: string,
  ): Promise<FlightDto> {
    return await this.flightRepository.findOne({
      flightId: _flightId,
      flightDate: _dateDeparture,
    });
  }

  async removeFlight(_flightId: number): Promise<void> {
    await this.bookingRepository.delete(_flightId);
    return;
  }

  //
  //Seat Function
  createSeat(_seat: SeatDto): Promise<SeatDto> {
    return this.seatRepository.save(_seat);
  }

  async getSeats(_flightId: number): Promise<SeatDto[]> {
    return await this.seatRepository.find({ flightId: _flightId });
  }

  async getEmptySeats(_flightId: number): Promise<SeatDto[]> {
    return this.entityManager.query(
      'SELECT seatId FROM `seat_entity` JOIN flight_entity ON flight_entity.flightId = seat_entity.flightId WHERE seatId NOT IN (SELECT seatId FROM `booking_entity`) AND flight_entity.flightId = $1;',
      [_flightId],
    );
  }

  async getUnavailableSeats(_flightId: number): Promise<SeatDto[]> {
    return this.entityManager.query(
      'SELECT seatId FROM `seat_entity` JOIN flight_entity ON flight_entity.flightId = seat_entity.flightId WHERE seatId IN (SELECT seatId FROM `booking_entity`) AND flight_entity.flightId = $1;',
      [_flightId],
    );
  }

  async searchSeats(_seatId: number): Promise<any> {
    try {
      return await this.seatRepository.findOne({ seatId: _seatId });
    } catch (error) {
      return await error;
    }
  }

  //
  //Booking Function
  createBooking(_booking: BookingDto): Promise<BookingDto> {
    return this.bookingRepository.save(_booking);
  }
  getBooking(): Promise<BookingDto[]> {
    return this.bookingRepository.find();
  }
  async searchBooking(_bookingId: number): Promise<BookingDto> {
    return await this.bookingRepository.findOne({ bookingId: _bookingId });
  }
}
