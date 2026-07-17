import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting RBAC Data Migration...');

  // 1. Ensure the new OWNER role exists
  const ownerRoleId = '00000000-0000-0000-0000-000000000002';
  console.log('Ensure OWNER role exists...');
  const ownerRole = await prisma.role.upsert({
    where: { id: ownerRoleId },
    update: { name: 'OWNER' },
    create: {
      id: ownerRoleId,
      name: 'OWNER',
      description: 'Owner and main administrator of the organization',
      isSystem: true,
    },
  });
  console.log(`OWNER role resolved with ID: ${ownerRole.id}`);

  // 2. Find ADMIN and ORGANIZATION_OWNER roles
  const legacyRoles = await prisma.role.findMany({
    where: {
      name: { in: ['ADMIN', 'ORGANIZATION_OWNER'] },
    },
  });

  const legacyRoleIds = legacyRoles.map(r => r.id);
  console.log(`Found ${legacyRoles.length} legacy roles to migrate: ${legacyRoles.map(r => r.name).join(', ')}`);

  // 3. Migrate Users to the new OWNER role
  if (legacyRoleIds.length > 0) {
    const updatedUsers = await prisma.user.updateMany({
      where: {
        roleId: { in: legacyRoleIds },
      },
      data: {
        roleId: ownerRoleId,
      },
    });
    console.log(`Migrated ${updatedUsers.count} users to OWNER role.`);
  }

  // 4. Update retroactive accountType for all users
  const orgUsers = await prisma.user.updateMany({
    where: {
      organizationId: { not: null },
    },
    data: {
      accountType: 'ORGANIZATION',
    },
  });
  console.log(`Set ORGANIZATION accountType for ${orgUsers.count} users with an organization.`);

  const indUsers = await prisma.user.updateMany({
    where: {
      organizationId: null,
    },
    data: {
      accountType: 'INDIVIDUAL',
    },
  });
  console.log(`Set INDIVIDUAL accountType for ${indUsers.count} users without an organization.`);

  // 5. Update retroactive accountType for all organizations
  const orgCount = await prisma.organization.updateMany({
    data: {
      accountType: 'ORGANIZATION',
    },
  });
  console.log(`Set ORGANIZATION accountType for ${orgCount.count} organizations.`);

  // 6. Backfill ownerId for existing Events
  console.log('Backfilling ownerId for existing events...');
  const events = await prisma.event.findMany({
    select: {
      id: true,
      createdById: true,
      organization: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  let backfillCount = 0;
  for (const event of events) {
    // Determine the owner of the event
    // Fallback: createdById -> organization.ownerId -> first user in system
    let resolvedOwnerId = event.createdById;
    if (!resolvedOwnerId && event.organization?.ownerId) {
      resolvedOwnerId = event.organization.ownerId;
    }
    if (!resolvedOwnerId) {
      const firstUser = await prisma.user.findFirst({ select: { id: true } });
      if (firstUser) {
        resolvedOwnerId = firstUser.id;
      }
    }

    if (resolvedOwnerId) {
      await prisma.event.update({
        where: { id: event.id },
        data: {
          ownerId: resolvedOwnerId,
        },
      });
      backfillCount++;
    }
  }
  console.log(`Successfully backfilled ownerId for ${backfillCount} events.`);

  // 7. Cleanup legacy roles and their role-permission assignments
  if (legacyRoleIds.length > 0) {
    console.log('Cleaning up legacy role permissions...');
    const deletedPermissions = await prisma.rolePermission.deleteMany({
      where: {
        roleId: { in: legacyRoleIds },
      },
    });
    console.log(`Deleted ${deletedPermissions.count} legacy role-permission records.`);

    console.log('Deleting legacy roles...');
    const deletedRoles = await prisma.role.deleteMany({
      where: {
        id: { in: legacyRoleIds },
      },
    });
    console.log(`Deleted ${deletedRoles.count} legacy roles.`);
  }

  console.log('🎉 RBAC Data Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
