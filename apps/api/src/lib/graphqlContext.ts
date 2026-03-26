export type CurrentUser = {
  userId: string;
  roles: string[];
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

export type TaskManagementContainer = {
  repo: any
}


export type GraphQLContext = {
  currentUser: CurrentUser;
  identityAccess: IdentityAccessContainer;
  caregiverManagement: CaregiverManagementContainer;
  residentManagement: ResidentManagementContainer;
  taskManagement: TaskManagementContainer;
};