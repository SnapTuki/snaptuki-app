// IdentityAccess/infrastructure/security/JwtTokenService.ts
import jwt from 'jsonwebtoken';
import { TokenService } from '../../application/interfaces/tokenService';

export class JwtTokenService implements TokenService {
  constructor(private readonly secret: string) {
    if (!secret) throw new Error('JWT secret not provided');
  }

  generate(payload: { sub: string; roles: string[] }, opts?: { expiresIn?: string | number }): string {
    return jwt.sign(payload, this.secret);
  }

  verify<T = any>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }
}