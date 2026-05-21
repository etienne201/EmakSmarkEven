"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Title must be at least 2 characters').max(255),
    slug: zod_1.z.string().max(255).optional(),
    description: zod_1.z.string().optional(),
    eventType: zod_1.z.nativeEnum(client_1.EventTypeKey),
    visibility: zod_1.z.nativeEnum(client_1.VisibilityType).optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional(),
    location: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
exports.updateEventSchema = exports.createEventSchema.partial().extend({
    status: zod_1.z.enum(['draft', 'review', 'published', 'completed', 'archived']).optional(),
    setupCompleted: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=event.schema.js.map