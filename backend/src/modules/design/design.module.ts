import { Module } from '@nestjs/common';
import { ThemesController } from './themes.controller';
import { AIController } from './ai.controller';
import { ContentController } from './content.controller';
import { AssetsController } from './assets.controller';
import { DesignsController } from './designs.controller';
import { DesignService } from './design.service';

@Module({
  controllers: [
    ThemesController,
    AIController,
    ContentController,
    AssetsController,
    DesignsController,
  ],
  providers: [DesignService],
  exports: [DesignService],
})
export class DesignModule {}
