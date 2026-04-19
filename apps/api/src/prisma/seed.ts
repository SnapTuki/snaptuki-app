import {
  PrismaClient,
  Gender,
  ROLE,
  CaregiverStatus,
  EmploymentType,
  MobilityLevel,
  AllergySeverity,
  TaskCategory,
  TaskPriority,
  TaskFrequency,
  TaskStatus,
  ResidentStatus,
  VisitStatus,
  CaregiverRole // Added based on your schema
} from '../generated/prisma/client';
import { Argon2PasswordHasher } from '../domains/identityAccess/infrastructure/security/argon2PasswordHasher';

const prisma = new PrismaClient();

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log('🌱 Starting Professional Database Seeding...');

  const hasher = new Argon2PasswordHasher();
  const passwordHash = await hasher.hash('12345678');

  // 1. ORGANIZATION
  const agency = await prisma.careHomeAgency.create({
    data: {
      name: 'Snaptuki Care Helsinki',
      address: 'Mannerheimintie 1, 00100 Helsinki',
    },
  });

  // 2. COORDINATOR (Staff Profile)
  const coordinator = await prisma.user.create({
    data: {
      email: 'hamid.aebadi@snaptuki.com',
      passwordHash,
      firstName: 'Hamid',
      lastName: 'Aebadi',
      roles: [ROLE.AGENCY_STAFF, ROLE.SUPERVISOR],
      agencyId: agency.id,
      staffProfile: {
        create: {
          department: 'Operations',
          title: 'Head Coordinator',
          canAssignTasks: true
        }
      }
    },
  });

  // 3. 10 CAREGIVERS
  const cgNames = [
    { f: 'Anna', l: 'Laine' }, { f: 'Mikko', l: 'Virtanen' }, { f: 'Laura', l: 'Mäkinen' },
    { f: 'Juha', l: 'Heikkinen' }, { f: 'Sari', l: 'Koskinen' }, { f: 'Pekka', l: 'Järvinen' },
    { f: 'Tiina', l: 'Lehtonen' }, { f: 'Antti', l: 'Saarinen' }, { f: 'Minna', l: 'Salonen' },
    { f: 'Eero', l: 'Rinne' }
  ];

  const caregivers = [];
  for (const name of cgNames) {
    const user = await prisma.user.create({
      data: {
        email: `${name.f.toLowerCase()}.${name.l.toLowerCase()}@snaptuki.com`,
        passwordHash,
        firstName: name.f,
        lastName: name.l,
        roles: [ROLE.CAREGIVER],
        agencyId: agency.id,
        caregiverProfile: {
          create: {
            phone: `+358 40 ${Math.floor(1000000 + Math.random() * 9000000)}`,
            status: CaregiverStatus.ACTIVE,
            role: CaregiverRole.HEAD_NURSE, // Uses the Enum from your schema
            employmentType: getRandom([EmploymentType.FULL_TIME, EmploymentType.PART_TIME]),
            hireDate: new Date('2023-01-01'),
          },
        },
      },
      include: { caregiverProfile: true }
    });
    caregivers.push(user.caregiverProfile!);
  }

  // 5. 15 RESIDENTS
  const resNames = [
    { f: 'Eeva', l: 'Korhonen' }, { f: 'Olli', l: 'Nieminen' }, { f: 'Ritva', l: 'Hämäläinen' },
    { f: 'Kari', l: 'Korpela' }, { f: 'Aino', l: 'Mustonen' }, { f: 'Pentti', l: 'Paananen' },
    { f: 'Seija', l: 'Salo' }, { f: 'Jorma', l: 'Peltonen' }, { f: 'Pirjo', l: 'Vatanen' },
    { f: 'Heikki', l: 'Aalto' }, { f: 'Marjatta', l: 'Kivi' }, { f: 'Veikko', l: 'Lehto' },
    { f: 'Tuula', l: 'Jokinen' }, { f: 'Antero', l: 'Laakso' }, { f: 'Sinikka', l: 'Koivisto' }
  ];

  for (const name of resNames) {
    const resident = await prisma.resident.create({
      data: {
        mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
        firstName: name.f,
        lastName: name.l,
        birthDate: new Date(1935 + Math.floor(Math.random() * 15), 5, 20),
        gender: getRandom([Gender.MALE, Gender.FEMALE]),
        status: ResidentStatus.ACTIVE,
        mobilityLevel: getRandom([MobilityLevel.ASSISTED, MobilityLevel.MEMORY]),
        room: `${Math.floor(1 + Math.random() * 4)}0${Math.floor(Math.random() * 9)}`,
        agencyId: agency.id,

        // Medical Data
        allergies: { create: [{ name: 'Lactose', reaction: 'Stomach Pain', severity: AllergySeverity.MILD }] },
        medications: { create: [{ name: 'Panadol', dosage: '500mg', frequency: 'As needed', startDate: new Date() }] },
        emergencyContacts: { create: [{ name: 'Family', relation: 'Daughter', phone: '040555', isPrimary: true }] }
      }
    });


    // 7. CREATE 1 VISIT FOR EACH RESIDENT
    await prisma.visit.create({
      data: {
        caregiverId: getRandom(caregivers).id,
        residentId: resident.residentId, // Matches your @id name in schema
        status: VisitStatus.PLANNED,
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 3600000),
      }
    });
  }

  console.log(`✅ Seed Success: 1 Agency, 1 Coordinator, 10 Caregivers, 15 Residents, 75 Tasks.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });