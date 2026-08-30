export type CurrentUser = {
  userId: string;
  roles: string[];
  agencyID: number;
} | null;

export type IdentityAccessContainer = {
  repo: any;     // PrismaUserAccountRepository
  hasher: any;   // Argon2PasswordHasher
  tokens: any;   // JwtTokenService
};

export type CaregiverManagementContainer = {
  repo: any;
}

export type ResidentManagementContainer = {
  repo: any
}

export type CareTaskCoordinationContainer = {
  repo: any
}


export type GraphQLContext = {
  currentUser: CurrentUser;
  identityAccess: IdentityAccessContainer;
  caregiverManagement: CaregiverManagementContainer;
  residentManagement: ResidentManagementContainer;
  careTaskCoordination: CareTaskCoordinationContainer;
};