import { PrismaClient } from '@prisma/client';

export async function generateUniqueOrgSlug(
  prisma: PrismaClient,
  name: string,
): Promise<string> {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

  let slug = base;
  let attempt = 0;

  let isUnique = false;
  while (!isUnique) {
    const existing = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!existing) {
      isUnique = true;
    } else {
      attempt++;
      slug = `${base}-${attempt}`;
    }
  }
  return slug;
}