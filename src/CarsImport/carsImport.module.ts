import { Module } from '@nestjs/common';
import { CarsImportController } from './carsImport.controller';
import { CarsImportService } from './carsImport.service';

@Module({
  controllers: [CarsImportController],
  providers: [CarsImportService],
})
export class CarsImportModule {}
