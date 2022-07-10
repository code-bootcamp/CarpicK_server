import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageFileService } from './imageFile.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class ImageFileResolver {
  constructor(
    private readonly imageFileService: ImageFileService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    return this.imageFileService.upload({ files });
  }
}
