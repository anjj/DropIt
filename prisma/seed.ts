import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const apps = [
    { name: "DropIt", slug: "dropit" },
    { name: "Portal Interno", slug: "portal-interno" },
    { name: "ERP", slug: "erp" },
    { name: "CRM", slug: "crm" },
  ];

  for (const app of apps) {
    await prisma.application.upsert({
      where: { slug: app.slug },
      update: {},
      create: app,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
