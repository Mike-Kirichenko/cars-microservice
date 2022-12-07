import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CarsImportService {
  constructor(@Inject('CARS-IMPORT') private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  public parseByChunks(path: string) {
    createReadStream(path)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
        this.client.send('get_chunks', row).toPromise();
      })
      .on('end', function () {
        console.log('finished');
      })
      .on('error', function (error) {
        console.log(error.message);
      });
  }
}
