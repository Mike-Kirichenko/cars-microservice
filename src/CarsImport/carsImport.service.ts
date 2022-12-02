import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsImportService {
  public carsImportServiceCall() {
    return 'ok';
  }
}
