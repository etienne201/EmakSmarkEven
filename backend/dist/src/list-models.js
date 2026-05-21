"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
console.log(Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
//# sourceMappingURL=list-models.js.map