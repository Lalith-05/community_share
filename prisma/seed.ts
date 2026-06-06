import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    "Tools",
    "Electronics",
    "Sports",
    "Books",
    "Kitchen",
    "Gaming",
    "Other",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
  