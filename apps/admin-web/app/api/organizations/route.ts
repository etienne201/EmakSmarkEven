import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../backend/lib/api-handler';
import { withAuth } from '../../../backend/middlewares/auth';
import prisma from '../../../backend/lib/prisma';
import { ForbiddenError } from '../../../backend/lib/errors';

export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    // Only return organizations the user is a member of or owns
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { users: { some: { id: user.id } } }
        ]
      }
    });

    return NextResponse.json({ data: organizations });
  });
});

export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    // Only superadmins or specific roles can create root organizations
    if (user.role.name !== 'superadmin' && user.role.name !== 'admin') {
      throw new ForbiddenError('You do not have permission to create an organization');
    }

    const body = await req.json();
    
    const organization = await prisma.organization.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ownerId: user.id,
      }
    });

    return NextResponse.json({ data: organization }, { status: 201 });
  });
});
