export interface PasswordPolicy {
  ensureStrong(password: string): void;
}

export class DefaultPasswordPolicy implements PasswordPolicy {
  ensureStrong(password: string) {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
  }
}