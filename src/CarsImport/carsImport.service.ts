import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

@Injectable()
export class CarsImportService {
  public parseByChunks(path: string) {
    createReadStream(path)
      .pipe(parse({ delimiter: ',' }))
      .on('data', function (row) {
        return row;
      })
      .on('end', function () {
        console.log('finished');
      })
      .on('error', function (error) {
        console.log(error.message);
      });
  }
}
