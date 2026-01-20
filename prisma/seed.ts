import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.report.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.appState.deleteMany({});


  // Create an admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      role: 'ADMIN',
    },
  });

  // Create a session for the admin user
  await prisma.session.create({
    data: {
      userId: admin.id,
      expires: new Date(Date.now() + 86400 * 1000), // 24 hours
      sessionToken: 'test-session-token',
    },
  });

    // Create one pending report by the admin
    await prisma.report.create({
        data: {
          latitude: 44.755,
          longitude: -0.385,
          issueType: 'FLOODING_WATER_ISSUE',
          severity: 'MEDIUM',
          status: 'PENDING',
          authorId: admin.id,
        },
      });

  console.log('Admin user and session created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
