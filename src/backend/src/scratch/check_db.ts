import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admins.findMany();
  console.log('--- ADMINS IN DATABASE ---');
  console.log(`Total count: ${admins.length}`);
  admins.forEach(a => {
    console.log(`- ID: ${a.id}, Name: ${a.name}, Email: ${a.email}`);
  });
  
  const superAdmins = await prisma.superAdmin.findMany();
  console.log('\n--- SUPER ADMINS IN DATABASE ---');
  console.log(`Total count: ${superAdmins.length}`);
  superAdmins.forEach(sa => {
    console.log(`- ID: ${sa.id}, Name: ${sa.name}, Email: ${sa.email}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
