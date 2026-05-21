import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { GuestService } from './guest.service';
import { InvitationsController } from './sub-modules/invitations/invitations.controller';
import { QRController } from './sub-modules/qr/qr.controller';
import { CheckinController } from './sub-modules/checkins/checkin.controller';
import { TablesController } from './sub-modules/tables/tables.controller';

@Module({
  controllers: [
    GuestsController,
    InvitationsController,
    QRController,
    CheckinController,
    TablesController,
  ],
  providers: [GuestService],
})
export class GuestModule {}
