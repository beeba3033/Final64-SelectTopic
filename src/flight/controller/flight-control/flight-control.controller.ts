/* eslint-disable prefer-const */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookingDto } from 'src/flight/dto/booking/booking-dto';
import { FlightDto } from 'src/flight/dto/flight/flight-dto';
import { SeatDto } from 'src/flight/dto/seat/seat-dto';
import { FlightService } from 'src/flight/service/flight/flight.service';
import { json } from 'stream/consumers';

@Controller('flight-control')
export class FlightControlController {
  constructor(private flightService: FlightService) {}

  //Narodom
  //Flight
  @Post('Flight')
  createFlight(@Body() newFlight: FlightDto): Promise<FlightDto> {
    return this.flightService.createFlight(newFlight);
  }
  @Post('Flight/:Seat')
  async createCompleteFlight(
    @Param('Seat') seatNumber: number,
    @Body() newFlight: FlightDto,
  ): Promise<FlightDto> {
    if (
      newFlight.flightId != null &&
      newFlight.flightDate != null &&
      newFlight.locationArrival != null &&
      newFlight.locationDeparture != null &&
      newFlight.timeArrival != null &&
      newFlight.timeDeparture != null &&
      seatNumber > 0
    ) {
      //Random ID
      let ranList: Array<number> = [];
      while (ranList.length < seatNumber) {
        let randNumber: number = Math.random() * Math.pow(10, 4);
        randNumber = JSON.parse(randNumber.toFixed(0));
        await this.flightService
          .searchSeats(randNumber)
          .then(async (result) => {
            if (result == undefined) {
              ranList.push(randNumber);
            }
          });
      }
      let character = 'A',
        count = 0;
      for (let i = 0; i < seatNumber; i++) {
        if (count >= 10) {
          character = String.fromCharCode(character.charCodeAt(0) + 1);
          count = 0;
        }
        let seatTxt: string = character + count;
        let newSeat: SeatDto = {
          seatId: ranList[i],
          flightId: newFlight.flightId,
          seatNumber: seatTxt,
        };
        this.flightService.createSeat(newSeat);
        count++;
      }
    }
    return this.flightService.createFlight(newFlight);
  }
  @Get('Flight')
  getFlights(): Promise<FlightDto[]> {
    return this.flightService.getFlights();
  }
  @Get('Flight/Select/:LocationDeparture/:LocationArrival/:FlightDate')
  async selectFlight(
    @Param('LocationDeparture') locationDeparture: string,
    @Param('LocationArrival') locationArrival: string,
    @Param('FlightDate') flightDate: string,
  ): Promise<FlightDto[]> {
    return await this.flightService.selectFlights(
      locationDeparture,
      locationArrival,
      flightDate,
    );
  }

  //Narodom
  //Seat
  @Post('Seat/:ID')
  async createSeats(
    @Param('ID') ID: number,
    @Body() newSeat: SeatDto,
  ): Promise<SeatDto> {
    const checking = await this.flightService.searchFlights(ID);
    newSeat.flightId = checking.flightId;
    return this.flightService.createSeat(newSeat);
  }
  @Get('Seat/:ID')
  async getSeats(@Param('ID') flightId: number): Promise<SeatDto[]> {
    return this.flightService.getSeats(flightId);
  }

  @Get('Seat/isEmpty/:ID')
  async isEmpty(@Param('ID') flightId: number): Promise<SeatDto[]> {
    return await this.flightService.getEmptySeats(flightId);
  }

  @Get('Seat/unAvailable/:ID')
  async unAvailable(@Param('ID') flightId: number): Promise<SeatDto[]> {
    return await this.flightService.getUnavailableSeats(flightId);
  }

  //Narodom
  //Booking
  @Post('Booking/:FID/:SID/:DDate')
  async createBooking(
    @Param('FID') flightId: number,
    @Param('SID') seatId: number,
    @Param('DDate') departureDate: string,
    @Body() Booking: BookingDto,
  ): Promise<BookingDto> {
    let had = false;
    for (
      let i = 0;
      i < (await this.flightService.getEmptySeats(flightId)).length;
      i++
    ) {
      if (
        (await this.flightService.getEmptySeats(flightId)).at(i).seatId ==
        seatId
      ) {
        had = true;
      }
    }
    if (had) {
      await this.flightService
        .validateFlights(flightId, departureDate)
        .then(async (result) => {
          if (result != undefined) {
            Booking.flightId = flightId;
            Booking.dateDeparture = departureDate;
          }
        });
      await this.flightService.searchSeats(seatId).then((result) => {
        if (result != undefined) {
          Booking.seatId = seatId;
        }
      });
      if (Booking.infants == null || Booking.infants == undefined) {
        Booking.infants = 0;
      }
      if (Booking.children == null || Booking.children == undefined) {
        Booking.children = 0;
      }
      if (Booking.adults == null || Booking.adults == undefined) {
        Booking.adults = 0;
      }
    }
    return this.flightService.createBooking(Booking);
  }
  @Post('Booking/:FID/:SID/:DDate/Two-way/:TwoFID/:TwoSID/:TwoDDate')
  async createBookingTwoWay(
    @Param('FID') flightId1: number,
    @Param('SID') seatId1: number,
    @Param('DDate') departureDate1: string,
    @Param('TwoFID') flightId2: number,
    @Param('TwoSID') seatId2: number,
    @Param('TwoDDate') departureDate2: string,
    @Body() Booking: BookingDto,
  ): Promise<any> {
    let had1 = false,
      had2 = false,
      i = 0;
    for (
      i = 0;
      i < (await this.flightService.getEmptySeats(flightId1)).length;
      i++
    ) {
      if (
        (await this.flightService.getEmptySeats(flightId1)).at(i).seatId ==
        seatId1
      ) {
        had1 = true;
      }
    }
    for (
      i = 0;
      i < (await this.flightService.getEmptySeats(flightId2)).length;
      i++
    ) {
      if (
        (await this.flightService.getEmptySeats(flightId2)).at(i).seatId ==
        seatId2
      ) {
        had2 = true;
      }
    }
    const flight1 = this.flightService.searchFlights(flightId1),
      flight2 = this.flightService.searchFlights(flightId2);
    let booking1: BookingDto = JSON.parse(JSON.stringify(Booking));
    let booking2: BookingDto = JSON.parse(JSON.stringify(Booking));
    if (
      (await flight1).locationDeparture == (await flight2).locationArrival &&
      (await flight1).locationArrival == (await flight2).locationDeparture &&
      had1 &&
      had2
    ) {
      //booking1
      await this.flightService
        .validateFlights(flightId1, departureDate1)
        .then(async (result) => {
          if (result != undefined) {
            booking1.flightId = flightId1;
            booking1.dateDeparture = departureDate1;
          }
        });
      await this.flightService.searchSeats(seatId1).then((result) => {
        if (result != undefined) {
          booking1.seatId = seatId1;
        }
      });
      if (booking1.infants == null || booking1.infants == undefined) {
        booking1.infants = 0;
      }
      if (booking1.children == null || booking1.children == undefined) {
        booking1.children = 0;
      }
      if (booking1.adults == null || booking1.adults == undefined) {
        booking1.adults = 0;
      }
      //booking2
      await this.flightService
        .validateFlights(flightId2, departureDate2)
        .then(async (result) => {
          if (result != undefined) {
            booking2.flightId = flightId2;
            booking2.dateDeparture = departureDate2;
          }
        });
      await this.flightService.searchSeats(seatId2).then((result) => {
        if (result != undefined) {
          booking2.seatId = seatId2;
        }
      });
      if (booking2.infants == null || booking2.infants == undefined) {
        booking2.infants = 0;
      }
      if (booking2.children == null || booking2.children == undefined) {
        booking2.children = 0;
      }
      if (booking2.adults == null || booking2.adults == undefined) {
        booking2.adults = 0;
      }
      try {
        await this.flightService.createBooking(booking1);

        await this.flightService.createBooking(booking2);
        return {
          Booking1: booking1,
          Booking2: booking2,
        };
      } catch (error) {}
    }
    return { invalid: 'cannot booking two way' };
  }
  @Get('Booking')
  getBooking(): Promise<BookingDto[]> {
    return this.flightService.getBooking();
  }
  @Put('Booking/Edit/:ID/:FID/:SID/:DDATE')
  async updatebookingเ(
    @Param('ID') bookingId: number,
    @Param('FID') flightId: number,
    @Param('SID') seatId: number,
    @Param('DDATE') dateDeparture: string,
    @Body() Booking: BookingDto,
  ): Promise<BookingDto> {
    const booking = await this.flightService.searchBooking(bookingId);

    await this.flightService
      .validateFlights(flightId, dateDeparture)
      .then(async (result) => {
        if (result != undefined) {
          Booking.flightId = flightId;
          Booking.dateDeparture = dateDeparture;
        }
      });
    await this.flightService.searchSeats(seatId).then((result) => {
      if (result != undefined) {
        Booking.seatId = seatId;
      }
    });
    booking.flightId = Booking.flightId;
    booking.seatId = Booking.seatId;
    if (Booking.dateDeparture != null)
      booking.dateDeparture = Booking.dateDeparture;
    return await this.flightService.createBooking(booking);
  }
  //Narodom
  //Delete
  //ID Booking
  @Delete(':ID')
  async delete(@Param('ID') ID: number): Promise<any> {
    await this.flightService.removeFlight(ID);
    return { sucesss: 'Delete Complete' };
  }
}
