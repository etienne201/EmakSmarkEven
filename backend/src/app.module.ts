import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { AdminModule } from './modules/admin/admin.module';
import { GuestModule } from './modules/guest/guest.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { RolesModule } from './modules/roles/roles.module';
import { EventsModule } from './modules/events/events.module';
import { DesignModule } from './modules/design/design.module';
import { FormsModule } from './modules/forms/forms.module';
import { NetworkingModule } from './modules/networking/networking.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PlatformModule } from './modules/platform/platform.module';
import { PublicModule } from './modules/public/public.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    PrismaModule,
    AuthModule,
    SuperAdminModule,
    AdminModule,
    GuestModule,
    UsersModule,
    OrganizationsModule,
    RolesModule,
    EventsModule,
    DesignModule,
    FormsModule,
    NetworkingModule,
    AnalyticsModule,
    NotificationsModule,
    PlatformModule,
    PublicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
