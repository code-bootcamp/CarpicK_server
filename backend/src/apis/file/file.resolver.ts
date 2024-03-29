import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  @Mutation(() => [String], { description: '파일 업로드' })
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload], description: '파일' })
    files: FileUpload[], //
  ): Promise<unknown[]> {
    return this.fileService.upload({ files });
  }
}
