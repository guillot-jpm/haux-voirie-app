
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'newcomer@test.com',
      role: 'NEWCOMER',
    },
  });

  await prisma.session.create({
    data: {
      sessionToken: 'test-session-token',
      userId: user.id,
      expires: new Date(Date.now() + 86400 * 1000), // 1 day
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
