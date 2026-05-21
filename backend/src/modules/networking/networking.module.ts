import { Module } from '@nestjs/common';
import { NetworkingController } from './networking.controller';
import { NetworkingService } from './networking.service';

@Module({
  controllers: [NetworkingController],
  providers: [NetworkingService],
  exports: [NetworkingService],
})
export class NetworkingModule {}
