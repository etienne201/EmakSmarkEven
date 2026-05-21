import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import { GuestService } from '../../../../../backend/services/guest.service';
import { EventService } from '../../../../../backend/services/event.service';
import { z } from 'zod';
import { ValidationError } from '../../../../../backend/lib/errors';
import { GuestRole } from '@prisma/client';

const addGuestSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  guestRole: z.nativeEnum(GuestRole).optional(),
});

export const GET = apiHandler(async (req: NextRequest, { id }: { id: string }) => {
  return withAuth(req, async (req, user) => {
    // Check if user has access to this event
    const orgId = user.role.name === 'superadmin' ? undefined : user.organizationId;
    await EventService.getEventById(id, orgId || undefined);

    const guests = await GuestService.listGuests(id);
    return NextResponse.json({ data: guests });
  });
});

export const POST = apiHandler(async (req: NextRequest, { id }: { id: string }) => {
  return withAuth(req, async (req, user) => {
    // Check if user has access to this event
    const orgId = user.role.name === 'superadmin' ? undefined : user.organizationId;
    await EventService.getEventById(id, orgId || undefined);

    const body = await req.json();
    const parsed = addGuestSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError('Validation Failed', parsed.error.errors);
    }

    const guest = await GuestService.addGuest(id, parsed.data);
    return NextResponse.json({ data: guest }, { status: 201 });
  });
});
