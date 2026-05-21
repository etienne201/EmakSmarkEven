import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function audit() {
  const guestId = "f954bbfc-06af-4565-8bfa-7d3a1818827a";
  const ownerId = "Emako123@";

  console.log(`Auditing Guest ID: ${guestId}`);
  const guest = await (prisma as any).guest.findUnique({
    where: { id: guestId },
    include: { event: true }
  });

  if (guest) {
    console.log("✅ Guest found:");
    console.log(JSON.stringify(guest, null, 2));
  } else {
    console.log("❌ Guest NOT found in database.");
  }

  console.log(`\nAuditing Admin ID (Owner): ${ownerId}`);
  const admin = await (prisma as any).admins.findUnique({
    where: { id: ownerId },
    include: { event: true }
  });

  if (admin) {
    console.log("✅ Admin found:");
    console.log(JSON.stringify(admin, null, 2));
  } else {
    console.log("❌ Admin NOT found in database.");
  }

  const allAdmins = await (prisma as any).admins.findMany({ take: 5 });
  console.log("\nSample Admins in DB:");
  console.log(allAdmins.map((a: any) => a.id));

  await prisma.$disconnect();
}

audit();
