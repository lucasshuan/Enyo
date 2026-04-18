import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [StorageService, UploadResolver],
  exports: [StorageService],
})
export class StorageModule {}
