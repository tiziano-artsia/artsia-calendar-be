import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import {NotificationsGateway} from "./notifications/notifications.gateway";


@Module({
  imports: [PrismaModule, AuthModule, UserModule, RequestModule,NotificationsGateway],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
