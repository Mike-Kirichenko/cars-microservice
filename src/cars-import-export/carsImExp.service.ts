import { HttpException, Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { ClientProxy } from '@nestjs/microservices';
import { unlink } from 'fs';

@Injectable()
export class CarsImpExpService {
  constructor(
    @Inject('CARS-IMPORT')
    @Inject('CARS-EXPORT')
    private readonly client: ClientProxy,
  ) {}

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

  public async getExportStatus() {
    return await this.client.send('export_list', '').toPromise();
  }

  public async getFile(sessionId: string) {
    const file = await this.client
      .send('get_exported_list_file', sessionId)
      .toPromise();
    if (file.status === 404) throw new HttpException(file.msg, 404);
  }
}
