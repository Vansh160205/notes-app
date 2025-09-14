import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  const acme = await prisma.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: { name: "Acme Inc", slug: "acme", plan: "FREE" },
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: "globex" },
    update: {},
    create: { name: "Globex Corp", slug: "globex", plan: "FREE" },
  });

  await prisma.user.upsert({
    where: { email: "admin@acme.test" },
    update: {},
    create: {
      email: "admin@acme.test",
      password: passwordHash,
      role: "ADMIN",
      tenantId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@acme.test" },
    update: {},
    create: {
      email: "user@acme.test",
      password: passwordHash,
      role: "MEMBER",
      tenantId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@globex.test" },
    update: {},
    create: {
      email: "admin@globex.test",
      password: passwordHash,
      role: "ADMIN",
      tenantId: globex.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@globex.test" },
    update: {},
    create: {
      email: "user@globex.test",
      password: passwordHash,
      role: "MEMBER",
      tenantId: globex.id,
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
