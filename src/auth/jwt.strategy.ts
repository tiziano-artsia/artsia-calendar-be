import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './costants'; // Le costanti del JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // La chiave segreta del JWT
    });
  }

  async validate(payload: { sub: string; email: string; role: string; name: string }) {
    // Log per il debug
    console.log('Payload decodificato:', payload);

    // Restituisci l'utente con tutti i campi necessari
    return { userId: payload.sub,name: payload.name, email: payload.email, role: payload.role,  };
  }
}
