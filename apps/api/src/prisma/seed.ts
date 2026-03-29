import { 
  PrismaClient, 
  Gender, 
  ROLE, 
  CaregiverRole, 
  CaregiverStatus, 
  EmploymentType, 
  MobilityLevel, 
  AllergySeverity, 
  TaskCategory, 
  TaskPriority 
} from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../domains/identityAccess/application/interfaces/passwordHasher';
import { Argon2PasswordHasher } from '../domains/identityAccess/infrastructure/security/argon2PasswordHasher';
const prisma = new PrismaClient();

// Helper to get random items from an array
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create a Base Agency
  const agency = await prisma.careHomeAgency.create({
    data: {
      name: 'Snaptuki Care Helsinki',
      address: 'Mannerheimintie 1, 00100 Helsinki, Finland',
    },
  });
  console.log(`✔️ Created Agency: ${agency.name}`);

  // 2. Hash the password "12345678"
  const hasher: PasswordHasher = new Argon2PasswordHasher();
  const passwordHash = await hasher.hash('12345678');

  // 3. Create the COORDINATOR Account
  const coordinator = await prisma.user.create({
    data: {
      email: 'hamid.aebadi@snaptuki.com',
      passwordHash,
      firstName: 'Hamid',
      lastName: 'Aebadi',
      roles: [ROLE.AGENCY_STAFF], // Identity role
      agencyId: agency.id,
    },
  });
  console.log(`✔️ Created Coordinator: ${coordinator.email}`);

  // 4. Create 10 Caregivers
  const caregiverFirstNames = ['Anna', 'Mikko', 'Laura', 'Juha', 'Sari', 'Matti', 'Minna', 'Pekka', 'Tiina', 'Antti'];
  const caregiverLastNames = ['Virtanen', 'Korhonen', 'Nieminen', 'Mäkinen', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen', 'Järvinen', 'Lehtonen'];
  
  const createdCaregivers = [];

  for (let i = 0; i < 10; i++) {
    const cg = await prisma.user.create({
      data: {
        email: `${caregiverFirstNames[i]}.${caregiverLastNames[i]}@snaptuki.com`,
        passwordHash,
        firstName: caregiverFirstNames[i],
        lastName: caregiverLastNames[i],
        roles: [ROLE.CAREGIVER],
        agencyId: agency.id,
        caregiverProfile: {
          create: {
            phone: `+358 40 555 000${i}`,
            role: CaregiverRole.CAREGIVER,
            status: CaregiverStatus.ACTIVE,
            employmentType: getRandom([EmploymentType.FULL_TIME, EmploymentType.PART_TIME, EmploymentType.CONTRACT]),
            hireDate: new Date(Date.now() - Math.random() * 10000000000), // Random past date
          },
        },
      },
      include: { caregiverProfile: true },
    });
    createdCaregivers.push(cg.caregiverProfile!);
  }
  console.log(`✔️ Created 10 Caregivers`);

  // 5. Create 10 Residents with Full Data
  const residentFirstNames = ['Eeva', 'Olli', 'Ritva', 'Kari', 'Aino', 'Pentti', 'Seija', 'Jorma', 'Pirjo', 'Heikki'];
  const residentLastNames = ['Saarinen', 'Salonen', 'Oksanen', 'Anttila', 'Ahonen', 'Väisänen', 'Tuominen', 'Leppänen', 'Hakala', 'Toivonen'];
  const medicationsList = [
    { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily in the morning' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' }
  ];

  const createdResidents = [];

  for (let i = 0; i < 10; i++) {
    const r = await prisma.resident.create({
      data: {
        mrn: `MRN-${10000 + i}`,
        firstName: residentFirstNames[i],
        lastName: residentLastNames[i],
        birthDate: new Date(1930 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), 1), // Born 1930-1950
        gender: getRandom([Gender.MALE, Gender.FEMALE]),
        mobilityLevel: getRandom([MobilityLevel.INDEPENDENT, MobilityLevel.ASSISTED, MobilityLevel.MEMORY]),
        room: `Room ${101 + i}`,
        primaryCaregiverId: getRandom(createdCaregivers).id, // Cross-context soft link
        careHomeAgencyId: agency.id,
        
        // Nested Medical Data
        medications: {
          create: [
            getRandom(medicationsList),
            getRandom(medicationsList)
          ].map(m => ({ ...m, startDate: new Date('2024-01-01'), prescribedBy: 'Dr. Salo' }))
        },
        allergies: {
          create: [
            { name: 'Penicillin', reaction: 'Hives', severity: AllergySeverity.SEVERE }
          ]
        },
        emergencyContacts: {
          create: [
            { name: `${residentFirstNames[i]}'s Child`, relation: 'Child', phone: '+358 50 123 4567', preferred: true }
          ]
        }
      }
    });
    createdResidents.push(r);
  }
  console.log(`✔️ Created 10 Residents with Medications, Allergies, and Contacts`);

  // 6. Create Tasks for Residents
  const taskTemplates = [
    { title: 'Morning Medication Administration', category: TaskCategory.MEDICATION, priority: TaskPriority.HIGH },
    { title: 'Assist with Bathing', category: TaskCategory.HYGIENE, priority: TaskPriority.MEDIUM },
    { title: 'Check Vital Signs', category: TaskCategory.CARE, priority: TaskPriority.HIGH },
    { title: 'Room Cleaning & Laundry', category: TaskCategory.ADMIN, priority: TaskPriority.LOW },
  ];

  for (const resident of createdResidents) {
    // Assign 2 random tasks to each resident
    for (let i = 0; i < 2; i++) {
      const template = getRandom(taskTemplates);
      const assignedCaregiver = getRandom(createdCaregivers);

      await prisma.task.create({
        data: {
          title: template.title,
          description: `Routine ${template.title.toLowerCase()} for ${resident.firstName} ${resident.lastName}`,
          category: template.category,
          priority: template.priority,
          residentId: resident.residentId, // Soft link to Resident
          assignedCaregiverId: assignedCaregiver.id, // Soft link to Caregiver
          createdByUserId: coordinator.userId, // Hamid created the task
          dueAt: new Date(Date.now() + 86400000), // Due tomorrow
          
          checklist: {
            create: [
              { label: 'Prepare supplies', required: true },
              { label: 'Verify patient identity', required: true },
              { label: 'Log completion notes', required: false },
            ]
          }
        }
      });
    }
  }
  console.log(`✔️ Created sample Tasks and Checklists for all Residents`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });