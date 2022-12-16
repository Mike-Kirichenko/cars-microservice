import { Module } from '@nestjs/common';
import { CarsImpExpController } from './carsImExp.controller';
import { CarsImpExpService } from './carsImExp.service';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CARS-IMPORT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672/cars-import-export'],
          queue: 'cars-import',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'CARS-EXPORT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672/cars-import-export'],
          queue: 'cars-export',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CarsImpExpController],
  providers: [CarsImpExpService],
})
export class CarsImpExpModule {}
