import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================
  // 1. ROLES
  // ============================================================
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'SUPER_ADMIN',
      description: 'Full system access - platform owner',
      isSystem: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'ADMIN',
      description: 'Organization administrator',
      isSystem: true,
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'MANAGER',
      description: 'Event manager within an organization',
      isSystem: true,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'VIEWER',
      description: 'Read-only access to organization data',
      isSystem: true,
    },
  });

  console.log('✅ Roles created:', [superAdminRole.name, adminRole.name, managerRole.name, viewerRole.name].join(', '));

  // ============================================================
  // 2. PERMISSIONS
  // ============================================================
  const permissionDefs = [
    // Organizations
    { key: 'organizations.list',   label: 'Lister les organisations',     scope: 'global' as const },
    { key: 'organizations.create', label: 'Créer une organisation',       scope: 'global' as const },
    { key: 'organizations.update', label: 'Modifier une organisation',    scope: 'organization' as const },
    { key: 'organizations.delete', label: 'Supprimer une organisation',   scope: 'global' as const },
    { key: 'organizations.users',  label: 'Gérer les utilisateurs org.',  scope: 'organization' as const },

    // Events
    { key: 'events.list',         label: 'Lister les événements',         scope: 'organization' as const },
    { key: 'events.create',       label: 'Créer un événement',            scope: 'organization' as const },
    { key: 'events.update',       label: 'Modifier un événement',         scope: 'event' as const },
    { key: 'events.delete',       label: 'Supprimer un événement',        scope: 'event' as const },
    { key: 'events.publish',      label: 'Publier un événement',          scope: 'event' as const },
    { key: 'events.settings',     label: 'Gérer les réglages événement',  scope: 'event' as const },
    { key: 'events.workflow',     label: 'Gérer le workflow événement',   scope: 'event' as const },

    // Guests
    { key: 'guests.list',         label: 'Lister les invités',            scope: 'event' as const },
    { key: 'guests.create',       label: 'Ajouter un invité',             scope: 'event' as const },
    { key: 'guests.update',       label: 'Modifier un invité',            scope: 'event' as const },
    { key: 'guests.delete',       label: 'Supprimer un invité',           scope: 'event' as const },
    { key: 'guests.import',       label: 'Importer des invités',          scope: 'event' as const },
    { key: 'guests.checkin',      label: 'Enregistrer check-in',          scope: 'event' as const },

    // Design
    { key: 'design.themes',       label: 'Gérer les thèmes',             scope: 'event' as const },
    { key: 'design.assets',       label: 'Gérer les assets',             scope: 'event' as const },
    { key: 'design.content',      label: 'Gérer le contenu',             scope: 'event' as const },

    // Forms
    { key: 'forms.manage',        label: 'Gérer les formulaires',         scope: 'event' as const },
    { key: 'forms.responses',     label: 'Voir les réponses',             scope: 'event' as const },

    // Platform
    { key: 'platform.settings',   label: 'Gérer paramètres platform',    scope: 'global' as const },
    { key: 'platform.templates',  label: 'Gérer les templates',          scope: 'global' as const },
    { key: 'platform.webhooks',   label: 'Gérer les webhooks',           scope: 'organization' as const },
    { key: 'platform.apikeys',    label: 'Gérer les clés API',           scope: 'organization' as const },
    { key: 'platform.audit',      label: 'Voir les logs d\'audit',       scope: 'global' as const },

    // Roles
    { key: 'roles.manage',        label: 'Gérer les rôles',              scope: 'global' as const },

    // Users
    { key: 'users.list',          label: 'Lister les utilisateurs',      scope: 'global' as const },
    { key: 'users.create',        label: 'Créer un utilisateur',         scope: 'global' as const },
    { key: 'users.update',        label: 'Modifier un utilisateur',      scope: 'organization' as const },
    { key: 'users.delete',        label: 'Supprimer un utilisateur',     scope: 'global' as const },

    // Analytics
    { key: 'analytics.view',      label: 'Voir les statistiques',        scope: 'event' as const },

    // Notifications
    { key: 'notifications.manage', label: 'Gérer les notifications',     scope: 'event' as const },
  ];

  const permissions = [];
  for (const pDef of permissionDefs) {
    const perm = await prisma.permission.upsert({
      where: { key: pDef.key },
      update: { label: pDef.label, scope: pDef.scope },
      create: pDef,
    });
    permissions.push(perm);
  }

  console.log(`✅ ${permissions.length} permissions created`);

  // ============================================================
  // 3. ROLE-PERMISSION ASSIGNMENTS
  // ============================================================

  // SUPER_ADMIN gets ALL permissions
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ SUPER_ADMIN → ${permissions.length} permissions assigned`);

  // ADMIN gets organization-level and event-level permissions
  const adminGlobalKeys = [
    'events.list',
    'guests.list',
    'analytics.view',
    'organizations.list',
  ];
  const adminPermKeys = permissions.filter(
    (p) => p.scope !== 'global' || adminGlobalKeys.includes(p.key),
  );
  for (const perm of adminPermKeys) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ ADMIN → ${adminPermKeys.length} permissions assigned`);

  // MANAGER gets event-level permissions
  const managerPermKeys = permissions.filter(
    (p) => p.scope === 'event',
  );
  for (const perm of managerPermKeys) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ MANAGER → ${managerPermKeys.length} permissions assigned`);

  // VIEWER gets only view/list permissions
  const viewerPermKeys = permissions.filter(
    (p) => p.key.includes('.list') || p.key.includes('.view') || p.key === 'forms.responses',
  );
  for (const perm of viewerPermKeys) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ VIEWER → ${viewerPermKeys.length} permissions assigned`);

  // ============================================================
  // 4. DEFAULT USERS
  // ============================================================
  const superPassword = await bcrypt.hash('Superadmin123@', 10);
  await prisma.user.upsert({
    where: { email: 'superadmin@smartevent.com' },
    update: { passwordHash: superPassword, roleId: superAdminRole.id },
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      email: 'superadmin@smartevent.com',
      passwordHash: superPassword,
      fullName: 'Super Admin System',
      roleId: superAdminRole.id,
      status: 'active',
      emailVerified: true,
    },
  });

  console.log('✅ Super Admin user created (superadmin@smartevent.com / Superadmin123@)');

  // Default organizer account — login: UserEven / User123@ (alias → usereven@smartevent.com)
  const userEvenId = '00000000-0000-0000-0000-000000000103';
  const userEvenOrgId = '00000000-0000-0000-0000-000000000201';
  const userEvenPassword = await bcrypt.hash('User123@', 10);

  await prisma.user.upsert({
    where: { email: 'usereven@smartevent.com' },
    update: {
      passwordHash: userEvenPassword,
      roleId: adminRole.id,
      fullName: 'UserEven',
      status: 'active',
      emailVerified: true,
    },
    create: {
      id: userEvenId,
      email: 'usereven@smartevent.com',
      passwordHash: userEvenPassword,
      fullName: 'UserEven',
      roleId: adminRole.id,
      status: 'active',
      emailVerified: true,
    },
  });

  await prisma.organization.upsert({
    where: { slug: 'usereven' },
    update: {
      name: 'UserEven Events',
      ownerId: userEvenId,
      isActive: true,
    },
    create: {
      id: userEvenOrgId,
      name: 'UserEven Events',
      slug: 'usereven',
      ownerId: userEvenId,
      isActive: true,
    },
  });

  await prisma.user.update({
    where: { id: userEvenId },
    data: { organizationId: userEvenOrgId },
  });

  console.log('✅ Default Admin user created (UserEven / User123@ → usereven@smartevent.com)');

  console.log('');
  console.log('🚀 Seeding completed successfully!');
  console.log('');
  console.log('📋 Default accounts:');
  console.log('   • Super Admin : superadmin@smartevent.com / Superadmin123@');
  console.log('   • Organisateur: UserEven / User123@');
  console.log('');
  console.log('📋 Role summary:');
  console.log(`   • SUPER_ADMIN → ${permissions.length} permissions (full system access)`);
  console.log(`   • ADMIN       → ${adminPermKeys.length} permissions (org + event level)`);
  console.log(`   • MANAGER     → ${managerPermKeys.length} permissions (event level only)`);
  console.log(`   • VIEWER      → ${viewerPermKeys.length} permissions (read-only)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

