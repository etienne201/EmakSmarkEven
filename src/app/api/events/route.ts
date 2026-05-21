import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../backend/lib/api-handler';
import { withAuth } from '../../../backend/middlewares/auth';
import { EventService } from '../../../backend/services/event.service';
import { createEventSchema } from '../../../backend/validations/event.schema';
import { ValidationError, ForbiddenError } from '../../../backend/lib/errors';

export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const orgId = req.nextUrl.searchParams.get('organizationId');
    
    if (!orgId) {
      throw new ValidationError('organizationId is required query parameter');
    }

    if (user.organizationId !== orgId && user.role.name !== 'superadmin') {
      throw new ForbiddenError('Access denied for this organization');
    }

    const events = await EventService.listEvents(orgId);
    return NextResponse.json({ data: events });
  });
});

export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const orgId = req.nextUrl.searchParams.get('organizationId') || user.organizationId;
    
    if (!orgId) {
      throw new ValidationError('User has no organization context');
    }

    const body = await req.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError('Validation Failed', parsed.error.errors);
    }

    const event = await EventService.createEvent(parsed.data, orgId, user.id);
    return NextResponse.json({ data: event }, { status: 201 });
  });
});
