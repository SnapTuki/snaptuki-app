export type CurrentUser = {
  userId: string;
  roles: string[];
} | null;

export type IdentityAccessContainer = {
  repo: any;     // PrismaUserAccountRepository
  hasher: any;   // Argon2PasswordHasher
  tokens: any;   // JwtTokenService
};

export type GraphQLContext = {
  currentUser: CurrentUser;
  identityAccess: IdentityAccessContainer;
  
};