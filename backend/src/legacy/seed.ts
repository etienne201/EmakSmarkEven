import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create SuperAdmin
  const superAdmin = await prisma.superAdmin.upsert({
    where: { email: 'superadmin@smartevent.com' },
    update: {},
    create: {
      id: 'super-admin-root',
      email: 'superadmin@smartevent.com',
      passwordHash: 'Superadmin123@', // Note: Clear for demo, use hashing in production
      name: 'Super Admin Root',
      isActive: true,
    },
  });
  console.log('✅ SuperAdmin created');

  // 2. Create a Default Admin / Organizer
  const defaultAdmin = await prisma.admins.upsert({
    where: { id: 'admin-demo-id' },
    update: {},
    create: {
      id: 'admin-demo-id',
      email: 'admin@smartevent.com',
      passwordHash: 'User123@',
      name: 'Organisateur Demo',
      eventId: 'DEMO-2026',
      status: 'active',
    },
  });
  console.log('✅ Default Admin created');

  // 3. Create a Default Event for the Admin
  const defaultEvent = await prisma.event.upsert({
    where: { adminId: defaultAdmin.id },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      adminId: defaultAdmin.id,
      title: 'Mariage de Marie & Jean',
      eventType: 'wedding',
      date: new Date('2026-06-20'),
      status: 'active',
      language: 'fr',
      design: {
        create: { colorAccent: '#FF5733' }
      },
      settings: {
        create: { allowSelfCheckin: true }
      }
    },
  });
  console.log('✅ Default Event created');

  console.log('🚀 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
