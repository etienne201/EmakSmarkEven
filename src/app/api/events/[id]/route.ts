import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import { EventService } from '../../../../backend/services/event.service';
import { updateEventSchema } from '../../../../backend/validations/event.schema';
import { ValidationError } from '../../../../backend/lib/errors';

export const GET = apiHandler(async (req: NextRequest, { id }: { id: string }) => {
  return withAuth(req, async (req, user) => {
    // Only fetch if belongs to user's org or user is superadmin
    const orgId = user.role.name === 'superadmin' ? undefined : user.organizationId;
    const event = await EventService.getEventById(id, orgId || undefined);
    
    return NextResponse.json({ data: event });
  });
});

export const PATCH = apiHandler(async (req: NextRequest, { id }: { id: string }) => {
  return withAuth(req, async (req, user) => {
    if (!user.organizationId) {
      throw new ValidationError('User organization context missing');
    }

    const body = await req.json();
    const parsed = updateEventSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError('Validation Failed', parsed.error.errors);
    }

    const event = await EventService.updateEvent(id, parsed.data, user.organizationId);
    return NextResponse.json({ data: event });
  });
});

export const DELETE = apiHandler(async (req: NextRequest, { id }: { id: string }) => {
  return withAuth(req, async (req, user) => {
    if (!user.organizationId) {
      throw new ValidationError('User organization context missing');
    }

    await EventService.deleteEvent(id, user.organizationId);
    return new NextResponse(null, { status: 204 });
  });
});
