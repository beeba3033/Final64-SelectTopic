import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FlightEntity {
  @PrimaryGeneratedColumn()
  flightId: number;

  @Column({ nullable: false })
  flightDate: string;

  @Column({ nullable: false })
  timeDeparture: string;

  @Column({ nullable: false })
  timeArrival: string;

  @Column({ nullable: false })
  locationDeparture: string;

  @Column({ nullable: false })
  locationArrival: string;
}
