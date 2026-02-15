// IdentityAccess/application/ports/UserAccountRepository.ts
import { User } from "../../domain/entities/user";

export interface UserRepository {
  findByUserId(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}