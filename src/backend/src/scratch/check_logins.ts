import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admins.findMany();
  console.log('--- ADMINS LOGIN DATA ---');
  admins.forEach(a => {
    console.log(`- ID: ${a.id}, Name: ${a.name}, LastLogin: ${a.lastLoginAt}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
