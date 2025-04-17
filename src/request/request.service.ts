import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus, RequestType } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async createRequest(userId: string, type: RequestType, startDate: string, endDate: string, hours: number | undefined) {
    try {
      console.log('Creazione richiesta per utente:', userId, 'Tipo:', type, 'Ore:', hours, 'Data inizio:', startDate, 'Data fine:', endDate);

      // Controllo se l'utente esiste
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Utente non trovato');
      }

      // Controllo che il tipo di richiesta sia valido
      if (!Object.values(RequestType).includes(type)) {
        throw new ForbiddenException(`Tipo di richiesta non valido: ${type}`);
      }

      // Validazione delle date
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Le date fornite non sono valide');
      }
      if (end < start) {
        throw new BadRequestException('La data di fine non può essere precedente alla data di inizio');
      }

      // Controllo che le ore siano fornite solo se il tipo è PERMESSO
      if (type === 'PERMESSO' && (hours === undefined || hours === null)) {
        throw new ForbiddenException('Le ore sono obbligatorie per il permesso');
      }

      // Creazione della richiesta
      return await this.prisma.request.create({
        data: {
          userId,
          type,
          status: RequestStatus.PENDING,
          startDate: start,
          endDate: end,
          hours: type === 'PERMESSO' ? hours : null, // Imposta `hours` a null per tipi diversi da PERMESSO
        },
      });
    } catch (error) {
      console.error('Errore durante la creazione della richiesta:', error);
      throw new ForbiddenException('Errore nella creazione della richiesta');
    }
  }

  async getUserRequests(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utente non trovato');
    }
    return this.prisma.request.findMany({ where: { userId } });
  }

  async getAllRequests() {
    return this.prisma.request.findMany();
  }

  async updateRequestStatus(requestId: string, status: RequestStatus, userRole: string) {
    if (userRole !== 'ADMIN' && userRole !== 'HR') {
      throw new ForbiddenException('Non hai i permessi per modificare le richieste');
    }

    // Controllo se la richiesta esiste
    const request = await this.prisma.request.findUnique({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundException('Richiesta non trovata');
    }

    return this.prisma.request.update({
      where: { id: requestId },
      data: { status },
    });
  }
}