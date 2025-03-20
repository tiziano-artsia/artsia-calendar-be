import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Funzione di registrazione
  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return this.generateToken(user);  // Passa l'intero oggetto utente, compreso il nome
  }

  // Funzione di login
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    console.log('Utente trovato nel database:', user); // 🔍 Debug

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }


  // Funzione per generare il token
  private generateToken(user: { id: string; name: string; email: string; role: string; }) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log('Payload prima di firmare il token:', payload); // 🔍 Debug

    return { access_token: this.jwtService.sign(payload) };
  }
}
