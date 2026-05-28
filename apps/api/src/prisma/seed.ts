import { 
  PrismaClient, 
  ROLE, 
  EmploymentType 
} from '../generated/prisma/client';
import { Argon2PasswordHasher } from '../domains/identityAccess/infrastructure/security/argon2PasswordHasher';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Professional Database Seeding...');

  const hasher = new Argon2PasswordHasher();
  const passwordHash = await hasher.hash('12345678');

  // 1. ORGANIZATION (Required to link the staff to a facility)
  const agency = await prisma.careHomeAgency.create({
    data: {
      name: 'Snaptuki Care Helsinki',
      address: 'Mannerheimintie 1, 00100 Helsinki',
    },
  });

  // 2. COORDINATOR (Strategy 1: Decoupled Creation)
  console.log('Creating Coordinator identity and staff profile...');

  // Step A: Create the core Identity record (IdentityAccess BC)
  const authUser = await prisma.user.create({
    data: {
      email: 'hamid.aebadi@snaptuki.com',
      passwordHash,
      firstName: 'Hamid',
      lastName: 'Aebadi',
      roles: [ROLE.COORDINATOR], // System auth roles
      agencyId: agency.id,
    },
  });

  // Step B: Create the Staff Domain record (StaffManagement BC)
  await prisma.staff.create({
    data: {
      id: authUser.userId,         // Soft-link to IdentityAccess
      firstName: authUser.firstName, // Duplicated name
      lastName: authUser.lastName,   // Duplicated name
      email: authUser.email,         // Duplicated email
      role:ROLE.COORDINATOR,           // Domain organizational role
      phone:'00465460500',
      employmentType: EmploymentType.FULL_TIME,
      hireDate: new Date(),
      birthDate: new Date("1996-03-21"),
      department: 'Operations',
      title: 'Head Coordinator',
    }
  });

  console.log(`✅ Seed Success: 1 Agency and 1 Coordinator (Hamid Aebadi) generated successfully.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });