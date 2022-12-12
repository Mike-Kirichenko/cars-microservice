import { Module } from '@nestjs/common';
import { CarsImportController } from './carsImport.controller';
import { CarsImportService } from './carsImport.service';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CARS-IMPORT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672/cars-import'],
          queue: 'cars-import',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CarsImportController],
  providers: [CarsImportService],
})
export class CarsImportModule {}
