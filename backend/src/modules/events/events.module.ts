import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SessionsController } from './sub-modules/sessions/sessions.controller';
import { SpeakersController } from './sub-modules/speakers/speakers.controller';
import { SponsorsController } from './sub-modules/sponsors/sponsors.controller';
import { VenuesController } from './sub-modules/venues/venues.controller';

@Module({
  controllers: [
    EventsController,
    SessionsController,
    SpeakersController,
    SponsorsController,
    VenuesController,
  ],
  providers: [EventsService],
})
export class EventsModule {}
