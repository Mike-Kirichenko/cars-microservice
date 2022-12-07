import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CarsImportService } from './carsImport.service';

@Controller('cars-import')
export class CarsImportController {
  constructor(private carsImportService: CarsImportService) {}

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
    this.carsImportService.parseByChunks(file.path);
  }
}
