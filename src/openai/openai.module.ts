import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import OpenAI from 'openai';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [OpenaiController],
  imports: [ConfigModule],
  providers: [
    OpenaiService,
    FileService,
    {
      provide: OpenAI,
      useFactory: (ConfigService: ConfigService) =>
        new OpenAI({ apiKey: ConfigService.getOrThrow('OPENAI_API_KEY') }),
      inject: [ConfigService],
    },
  ],
})
export class OpenaiModule {}
