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

  const ownerRole = await prisma.role.upsert({
    where: { name: 'OWNER' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'OWNER',
      description: 'Owner and main administrator of the organization',
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

  const eventAdminRole = await prisma.role.upsert({
    where: { name: 'EVENT_ADMIN' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      name: 'EVENT_ADMIN',
      description: 'Administrator of events',
      isSystem: true,
    },
  });

  const eventManagerRole = await prisma.role.upsert({
    where: { name: 'EVENT_MANAGER' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      name: 'EVENT_MANAGER',
      description: 'Manager of events',
      isSystem: true,
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'STAFF' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000008',
      name: 'STAFF',
      description: 'Event staff personnel',
      isSystem: true,
    },
  });

  const guestRole = await prisma.role.upsert({
    where: { name: 'GUEST' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000009',
      name: 'GUEST',
      description: 'Event guest / attendee',
      isSystem: true,
    },
  });

  console.log('✅ Roles created:', [
    superAdminRole.name,
    ownerRole.name,
    managerRole.name,
    viewerRole.name,
    eventAdminRole.name,
    eventManagerRole.name,
    staffRole.name,
    guestRole.name
  ].join(', '));

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
    { key: 'users.create_individual',   label: 'Créer un compte individuel',              scope: 'global' as const },
    { key: 'users.create_organization', label: 'Créer un compte organisation',            scope: 'global' as const },
    { key: 'users.create_staff',        label: 'Créer du personnel dans l\'organisation',  scope: 'organization' as const },
    { key: 'event_staff.assign',        label: 'Affecter du personnel à un événement',   scope: 'event' as const },
    { key: 'event_staff.revoke',        label: 'Révoquer une affectation de personnel',   scope: 'event' as const },

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

  // OWNER gets organization-level and event-level permissions
  const adminGlobalKeys = [
    'events.list',
    'guests.list',
    'analytics.view',
    'organizations.list',
    'users.create_individual',
    'users.create_organization',
  ];
  const adminPermKeys = permissions.filter(
    (p) => p.scope !== 'global' || adminGlobalKeys.includes(p.key),
  );

  const adminOwnerRoles = [ownerRole];
  for (const role of adminOwnerRoles) {
    for (const perm of adminPermKeys) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
    }
    console.log(`✅ ${role.name} → ${adminPermKeys.length} permissions assigned`);
  }

  // MANAGER, EVENT_ADMIN, and EVENT_MANAGER get event-level permissions
  const eventLevelPerms = permissions.filter(
    (p) => p.scope === 'event',
  );
  const eventRoles = [managerRole, eventAdminRole, eventManagerRole];
  for (const role of eventRoles) {
    for (const perm of eventLevelPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
    }
    console.log(`✅ ${role.name} → ${eventLevelPerms.length} permissions assigned`);
  }

  // STAFF gets checkin and basic event/guest list permissions
  const staffKeys = ['guests.list', 'guests.checkin', 'events.list'];
  const staffPermKeys = permissions.filter((p) => staffKeys.includes(p.key));
  for (const perm of staffPermKeys) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: staffRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: staffRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ STAFF → ${staffPermKeys.length} permissions assigned`);

  // GUEST gets basic view access (events.list)
  const guestKeys = ['events.list'];
  const guestPermKeys = permissions.filter((p) => guestKeys.includes(p.key));
  for (const perm of guestPermKeys) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: guestRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: guestRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ GUEST → ${guestPermKeys.length} permissions assigned`);

  // Ensure MANAGER gets users.create_staff
  const createStaffPerm = permissions.find((p) => p.key === 'users.create_staff');
  if (createStaffPerm) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: createStaffPerm.id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: createStaffPerm.id,
      },
    });
    console.log(`✅ Assigned users.create_staff to MANAGER`);
  }

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
      accountType: 'INDIVIDUAL',
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
      roleId: ownerRole.id,
      fullName: 'UserEven',
      status: 'active',
      emailVerified: true,
      accountType: 'ORGANIZATION',
    },
    create: {
      id: userEvenId,
      email: 'usereven@smartevent.com',
      passwordHash: userEvenPassword,
      fullName: 'UserEven',
      roleId: ownerRole.id,
      status: 'active',
      emailVerified: true,
      accountType: 'ORGANIZATION',
    },
  });

  await prisma.organization.upsert({
    where: { slug: 'usereven' },
    update: {
      name: 'UserEven Events',
      ownerId: userEvenId,
      isActive: true,
      accountType: 'ORGANIZATION',
    },
    create: {
      id: userEvenOrgId,
      name: 'UserEven Events',
      slug: 'usereven',
      ownerId: userEvenId,
      isActive: true,
      accountType: 'ORGANIZATION',
    },
  });

  await prisma.user.update({
    where: { id: userEvenId },
    data: { organizationId: userEvenOrgId },
  });

  console.log('✅ Default Owner user created (UserEven / User123@ → usereven@smartevent.com)');

  // ============================================================
  // 5. DESIGN STUDIO TEMPLATES & ASSETS
  // ============================================================
  console.log('🌱 Seeding Design Studio templates and assets...');
  
  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      name: 'Template Élégant Or',
      eventType: 'wedding',
      style: 'Elegant',
      previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
      layersData: {
        background: { color: '#0d0f12' },
        elements: [
          { type: 'text', text: 'Bienvenue à notre Mariage', fontSize: 40, fill: '#d4a642', left: 100, top: 100 }
        ]
      },
      isPremium: false,
    }
  });

  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      name: 'Template Conférence Moderne',
      eventType: 'conference',
      style: 'Corporate',
      previewUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      layersData: {
        background: { color: '#13161b' },
        elements: [
          { type: 'text', text: 'Conférence Tech 2026', fontSize: 45, fill: '#6c63ff', left: 100, top: 100 }
        ]
      },
      isPremium: true,
    }
  });

  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000403' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000403',
      name: 'Template Joyeux Anniversaire',
      eventType: 'birthday',
      style: 'Festive',
      previewUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
      layersData: {
        background: { color: '#1a0b2e' },
        elements: [
          { type: 'text', text: 'Joyeux Anniversaire !', fontSize: 48, fill: '#ff4081', left: 100, top: 100 }
        ]
      },
      isPremium: false,
    }
  });

  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000404' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000404',
      name: 'Template Soirée de Gala',
      eventType: 'gala',
      style: 'Prestige',
      previewUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      layersData: {
        background: { color: '#090a0f' },
        elements: [
          { type: 'text', text: 'Grande Soirée de Gala', fontSize: 42, fill: '#e5c158', left: 100, top: 100 }
        ]
      },
      isPremium: false,
    }
  });

  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000405' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000405',
      name: 'Template Festival d\'Été',
      eventType: 'festival',
      style: 'Dynamic',
      previewUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
      layersData: {
        background: { color: '#0a192f' },
        elements: [
          { type: 'text', text: 'Summer Music Festival', fontSize: 40, fill: '#00f2fe', left: 100, top: 100 }
        ]
      },
      isPremium: false,
    }
  });

  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000406' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000406',
      name: 'Template Minimaliste',
      eventType: 'other',
      style: 'Minimal',
      previewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      layersData: {
        background: { color: '#1e293b' },
        elements: [
          { type: 'text', text: 'Votre Événement', fontSize: 44, fill: '#10b981', left: 100, top: 100 }
        ]
      },
      isPremium: false,
    }
  });

  await prisma.designTemplate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000407' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000407',
      name: 'Template Concert Rock Live',
      eventType: 'concert',
      style: 'Rock',
      previewUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
      layersData: {
        background: { color: '#110303' },
        elements: [
          { type: 'text', text: 'ROCK CONCERT LIVE', fontSize: 48, fill: '#ff3333', left: 100, top: 100 }
        ]
      },
      isPremium: false,
    }
  });

  const assetsToSeed = [
    { id: '00000000-0000-0000-0000-000000000501', category: 'shape' as const, name: 'Cercle Or', url: '/assets/shapes/circle.svg', tags: ['circle', 'shape', 'gold'] },
    { id: '00000000-0000-0000-0000-000000000502', category: 'sticker' as const, name: 'Cœur d\'Amour', url: '/assets/stickers/heart.svg', tags: ['heart', 'love', 'red'] },
    { id: '00000000-0000-0000-0000-000000000503', category: 'icon' as const, name: 'Icône Calendrier', url: '/assets/icons/calendar.svg', tags: ['calendar', 'date', 'icon'] },
  ];

  for (const asset of assetsToSeed) {
    await prisma.designAsset.upsert({
      where: { id: asset.id },
      update: {},
      create: asset,
    });
  }

  console.log('✅ Design Studio templates and assets seeded.');

  console.log('');
  console.log('🚀 Seeding completed successfully!');
  console.log('');
  console.log('   • Super Admin : superadmin@smartevent.com / Superadmin123@');
  console.log('   • Organisateur: UserEven / User123@');
  console.log('');
  console.log('📋 Role summary:');
  console.log(`   • SUPER_ADMIN        → \${permissions.length} permissions (full system access)`);
  console.log(`   • OWNER              → \${adminPermKeys.length} permissions (org + event level)`);
  console.log(`   • EVENT_ADMIN        → \${eventLevelPerms.length} permissions (event level admin)`);
  console.log(`   • EVENT_MANAGER      → \${eventLevelPerms.length} permissions (event level manager)`);
  console.log(`   • STAFF              → \${staffPermKeys.length} permissions (checkin & basic access)`);
  console.log(`   • GUEST              → \${guestPermKeys.length} permissions (guest basic access)`);
  console.log(`   • VIEWER             → \${viewerPermKeys.length} permissions (read-only)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

