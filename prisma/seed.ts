import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      role: 'CITIZEN',
    },
  })

  await prisma.report.create({
    data: {
      latitude: 44.75,
      longitude: -0.38,
      issueType: 'POTHOLE',
      severity: 'HIGH',
      status: 'APPROVED',
      authorId: user.id,
    },
  })
  await prisma.report.create({
    data: {
      latitude: 44.751,
      longitude: -0.381,
      issueType: 'DAMAGED_SIGNAGE',
      severity: 'MEDIUM',
      status: 'APPROVED',
      authorId: user.id,
    },
  })
  await prisma.report.create({
    data: {
      latitude: 44.749,
      longitude: -0.379,
      issueType: 'OTHER',
      severity: 'LOW',
      status: 'APPROVED',
      authorId: user.id,
    },
  })
  console.log(`Seeding finished.`)
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
