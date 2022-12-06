import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientProxy } from '@nestjs/microservices';
import { CarsImportService } from './carsImport.service';

@Controller('cars-import')
export class CarsImportController {
  constructor(
    @Inject('CARS-IMPORT') private readonly client: ClientProxy,
    private carsImportService: CarsImportService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('cars_list', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueName}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        if (ext !== '.csv')
          return callback(
            new BadRequestException('Invalid file extension'),
            false,
          );
        return callback(null, true);
      },
    }),
  )
  importCars(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const chunk = this.carsImportService.parseByChunks(file.path);
    this.client.emit<any>('get_chunk', chunk);
  }
}
