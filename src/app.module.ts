import { Module } from '@nestjs/common';
import { CarsImportModule } from './CarsImport/carsImport.module';

@Module({
  imports: [CarsImportModule],
})
export class AppModule {}
