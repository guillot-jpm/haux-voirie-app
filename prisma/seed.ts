import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.report.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  });

  const citizen = await prisma.user.create({
    data: {
      name: 'Citizen User',
      email: 'citizen@example.com',
      role: 'CITIZEN',
    },
  });

  // Create one approved report by the admin
  await prisma.report.create({
    data: {
      latitude: 44.75,
      longitude: -0.38,
      issueType: 'POTHOLE',
      severity: 'HIGH',
      status: 'APPROVED',
      authorId: admin.id,
    },
  });

  // Create one pending report by the citizen
  await prisma.report.create({
    data: {
      latitude: 44.755,
      longitude: -0.385,
      issueType: 'FLOODING_WATER_ISSUE',
      severity: 'MEDIUM',
      status: 'PENDING',
      authorId: citizen.id,
    },
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
