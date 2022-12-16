import { Module } from '@nestjs/common';
import { CarsImpExpModule } from './cars-import-export/carsImExp.module';

@Module({
  imports: [CarsImpExpModule],
})
export class AppModule {}
