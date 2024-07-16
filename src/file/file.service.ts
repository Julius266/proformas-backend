import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';

@Injectable()
export class FileService implements OnModuleInit, OnModuleDestroy {
  private readonly uploadDir = join(__dirname, '..', '..', 'uploads');

  async onModuleInit() {
    await this.createUploadDir();
  }

  async onModuleDestroy() {
    await this.cleanUploadDir();
  }

  async createUploadDir() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir);
      console.log('Upload directory created:', this.uploadDir);
    }
  }

  async cleanUploadDir() {
    const files = readdirSync(this.uploadDir);
    for (const file of files) {
      unlinkSync(join(this.uploadDir, file));
    }
    console.log('Upload directory cleaned:', this.uploadDir);
  }

  async encodeImageToBase64(imagePath: string): Promise<string> {
    try {
      if (!imagePath) {
        throw new Error('El path de la imagen no está definido');
      }
      const imageBuffer = await fsPromises.readFile(imagePath);
      return imageBuffer.toString('base64');
    } catch (error) {
      console.error(`Error encoding image ${imagePath} to base64:`, error);
      throw error;
    }
  }
}
