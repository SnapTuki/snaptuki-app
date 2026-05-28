// IdentityAccess/infrastructure/security/Argon2PasswordHasher.ts
import argon2 from 'argon2';
import { PasswordHasher } from '../../../identityAccess/application/interfaces/passwordHasher';

export class Argon2PasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }
  async verify(plain: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}