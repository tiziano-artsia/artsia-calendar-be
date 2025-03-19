import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Importa il modulo di autenticazione

@Module({
  imports: [PrismaModule, AuthModule], // Aggiungi AuthModule
  controllers: [UserController],
})
export class UserModule {}
