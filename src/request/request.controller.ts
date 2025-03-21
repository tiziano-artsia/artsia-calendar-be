import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
    import { RequestService } from './request.service';
    import { JwtAuthGuard } from '../auth/jwt-auth.guard';
    import { RolesGuard } from '../auth/roles.guard';
    import { Roles } from '../auth/roles.decorator';
    import { RequestStatus, RequestType } from '@prisma/client';

    @Controller('requests')
    export class RequestController {
      constructor(private readonly requestService: RequestService) {}

      @UseGuards(JwtAuthGuard)
      @Post()
      async createRequest(
        @Request() req,
        @Body('type') type: RequestType,
        @Body('startDate') startDate: Date,
        @Body('endDate') endDate: Date,
        @Body('hours') hours: number
      ) {
        console.log('Dati utente:', req.user); // 🔍 Debug

        if (!req.user || !req.user.sub) {
          throw new ForbiddenException('Utente non autenticato');
        }

        return this.requestService.createRequest(req.user.sub, type, startDate, endDate, hours);
      }

      @UseGuards(JwtAuthGuard)
      @Get('me')
      async getUserRequests(@Request() req) {
        if (!req.user || !req.user.sub) {
          throw new ForbiddenException('Utente non autenticato');
        }

        return this.requestService.getUserRequests(req.user.sub);
      }

      @UseGuards(JwtAuthGuard)
      @Get()
      async getAllRequests() {
        return this.requestService.getAllRequests();
      }

      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles('ADMIN', 'HR') // Solo gli admin e HR possono modificare lo stato delle richieste
      @Put(':id/status')
      async updateRequestStatus(
        @Request() req,
        @Param('id') requestId: string,
        @Body('status') status: RequestStatus
      ) {
        console.log('Dati utente:', req.user); // 🔍 Debug

        return this.requestService.updateRequestStatus(requestId, status, req.user.role);
      }
    }