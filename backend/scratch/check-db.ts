import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'superadmin@smartevent.com' },
    include: { role: true }
  });
  console.log('User found:', user ? 'YES' : 'NO');
  if (user) {
    console.log('Email:', user.email);
    console.log('Role:', user.role.name);
    console.log('Status:', user.status);
    console.log('Password Hash starts with:', user.passwordHash.substring(0, 10));
  }
}

check().finally(() => prisma.$disconnect());
