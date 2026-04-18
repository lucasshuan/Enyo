import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { StorageService } from './storage.service';
import { UploadUrlResponse } from './dto/upload.output';

@Resolver()
export class UploadResolver {
  constructor(private storageService: StorageService) {}

  @Mutation(() => UploadUrlResponse)
  @UseGuards(GqlAuthGuard)
  async requestUploadUrl(
    @Args('filename') filename: string,
    @Args('contentType') contentType: string,
  ): Promise<UploadUrlResponse> {
    if (!this.storageService.isAllowedContentType(contentType)) {
      throw new BadRequestException(
        'Content type not allowed. Accepted: image/jpeg, image/png, image/webp, image/gif',
      );
    }

    return this.storageService.getPresignedPutUrl(filename, contentType);
  }
}
