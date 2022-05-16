import { Test, TestingModule } from '@nestjs/testing';
import { FlightControlController } from './flight-control.controller';

describe('FlightControlController', () => {
  let controller: FlightControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightControlController],
    }).compile();

    controller = module.get<FlightControlController>(FlightControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
