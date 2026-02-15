export interface TokenService {
  generate(payload: { sub: string; roles: string[] }, opts?: { expiresIn?: string | number }): string;
  verify<T = any>(token: string): T;
}
