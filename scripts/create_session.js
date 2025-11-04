const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function createSession(email) {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error(`User with email ${email} not found. Please seed the database.`);
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      sessionToken: sessionToken,
    },
  });

  console.log(`Session token: ${session.sessionToken}`);
}

const userEmail = process.argv[2];
if (!userEmail) {
  console.error("Please provide a user email.");
  process.exit(1);
}

createSession(userEmail).catch(e => {
  console.error(e);
  process.exit(1);
});
