import { Module } from '@nestjs/common';
import { ImageFileResolver } from './imageFile.resolver';
import { ImageFileService } from './imageFile.service';

@Module({
  imports: [],
  providers: [
    ImageFileResolver, //
    ImageFileService,
  ],
})
export class ImageFileModule {}
