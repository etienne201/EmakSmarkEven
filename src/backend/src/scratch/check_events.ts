import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  console.log('--- EVENTS IN DATABASE ---');
  console.log(`Total count: ${events.length}`);
  events.forEach(e => {
    console.log(`- AdminID: ${e.adminId}, Title: ${e.title}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
