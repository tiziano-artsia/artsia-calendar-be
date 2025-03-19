import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule

@Module({
  imports: [PrismaModule, AuthModule], // Assicurati di includere AuthModule
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
