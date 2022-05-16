import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn()
  bookingId: number;

  @Column({ nullable: false })
  flightId: number;

  @Column({ nullable: false })
  seatId: number;

  @Column({ nullable: false })
  passengerName: string;

  @Column({ nullable: false })
  passengerSurname: string;

  @Column({ nullable: false })
  dateDeparture: string;

  @Column({ nullable: false })
  adults: number;

  @Column({ nullable: true })
  children: number;

  @Column({ nullable: true })
  infants: number;
}
