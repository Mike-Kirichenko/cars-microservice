import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { ClientProxy } from '@nestjs/microservices';
import { unlink } from 'fs';

@Injectable()
export class CarsImportService {
  constructor(@Inject('CARS-IMPORT') private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  public parseByChunks(path: string) {
    let chunk = [];
    createReadStream(path)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
        chunk.push(row);
        if (chunk.length === 100) {
          console.log(chunk);
          this.client.send('get_chunk', chunk).toPromise();
          chunk = [];
        }
      })
      .on('end', () => {
        this.client.send('get_chunk', chunk).toPromise();
        unlink(path, () => console.log('import ended'));
      })
      .on('error', function (error) {
        console.log(error.message);
      });
  }
}
