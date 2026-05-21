const fs = require('fs');
const path = require('path');

const basePath = '/Users/test/Documents/QRcodeTempletMariage/src/app/api/v1';

const files = [
  { path: 'events/[id]/networking/route.ts', methods: ['GET'], auth: true },
  { path: 'conversations/route.ts', methods: ['POST'], auth: true },
  { path: 'conversations/[id]/route.ts', methods: ['GET'], auth: true },
  { path: 'conversations/[id]/messages/route.ts', methods: ['POST'], auth: true },
  { path: 'events/[id]/analytics/route.ts', methods: ['GET'], auth: true },
  { path: 'events/[id]/analytics/[metric]/route.ts', methods: ['GET'], auth: true },
  { path: 'notifications/route.ts', methods: ['GET'], auth: true },
  { path: 'notifications/send/route.ts', methods: ['POST'], auth: true },
  { path: 'notifications/send-bulk/route.ts', methods: ['POST'], auth: true },
  { path: 'events/[id]/publish/route.ts', methods: ['POST'], auth: true },
  { path: 'events/[id]/unpublish/route.ts', methods: ['POST'], auth: true },
  { path: 'public/events/[slug]/route.ts', methods: ['GET'], auth: false },
  { path: 'public/events/[slug]/sessions/route.ts', methods: ['GET'], auth: false },
  { path: 'public/invitations/[code]/route.ts', methods: ['GET'], auth: false },
  { path: 'templates/route.ts', methods: ['GET', 'POST'], auth: true },
  { path: 'templates/[id]/route.ts', methods: ['GET', 'PUT', 'DELETE'], auth: true },
  { path: 'webhooks/route.ts', methods: ['GET', 'POST'], auth: true },
  { path: 'webhooks/[id]/route.ts', methods: ['PUT', 'DELETE'], auth: true },
  { path: 'api-keys/route.ts', methods: ['GET', 'POST'], auth: true },
  { path: 'api-keys/[id]/route.ts', methods: ['DELETE'], auth: true },
  { path: 'security/audit-logs/route.ts', methods: ['GET'], auth: true },
  { path: 'security/login-history/route.ts', methods: ['GET'], auth: true }
];

files.forEach(f => {
  const fullPath = path.join(basePath, f.path);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });

  let content = `import { NextResponse } from "next/server";\nimport { apiHandler } from "@/backend/lib/api-handler";\n`;
  if (f.auth) {
    content += `import { withAuth } from "@/backend/middlewares/auth";\n`;
  }
  content += `\n`;

  f.methods.forEach(m => {
    content += `/**\n * @openapi\n * /api/v1/${f.path.replace('/route.ts', '')}:\n *   ${m.toLowerCase()}:\n *     summary: ${m} /api/v1/${f.path.replace('/route.ts', '')}\n *     responses:\n *       200:\n *         description: Success\n */\n`;
    if (f.auth) {
       content += `export const ${m} = apiHandler(\n  withAuth(async (req, { params }) => {\n    // TODO: Implement ${m} logic here\n    return NextResponse.json({ message: "Success", data: {} });\n  })\n);\n\n`;
    } else {
       content += `export const ${m} = apiHandler(\n  async (req, { params }) => {\n    // TODO: Implement ${m} logic here\n    return NextResponse.json({ message: "Success", data: {} });\n  }\n);\n\n`;
    }
  });

  fs.writeFileSync(fullPath, content);
});
console.log("All Phase 5 files generated successfully!");
