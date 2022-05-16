import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SeatEntity {
  @PrimaryGeneratedColumn()
  seatId: number;

  @Column()
  flightId: number;

  @Column()
  seatNumber: string;
}
