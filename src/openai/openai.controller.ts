import {
  Controller,
  Post,
  Get,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('analyze')
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async analyzeImages(@UploadedFiles() files) {
    console.log('Files received:', files);
    try {
      const imagePaths = files.map((file) => file.path);
      const aiResponse = await this.openaiService.analyzeImages(imagePaths);
      return { message: 'Imágenes analizadas con éxito.', aiResponse };
    } catch (error) {
      console.error('Error en el análisis de imágenes:', error);
      throw error;
    }
  }

  @Get('last-analysis')
  getLastAnalysis() {
    const lastResult = this.openaiService.getLastAnalysisResult();
    if (lastResult) {
      return {
        message: 'Último análisis recuperado con éxito.',
        data: lastResult,
      };
    } else {
      return { message: 'No se encontró ningún análisis reciente.' };
    }
  }
}
