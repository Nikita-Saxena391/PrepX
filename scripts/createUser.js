import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const existing = await db.user.findUnique({
    where: { clerkUserId: "demo-user" },
  });

  if (existing) {
    console.log("User already exists");
    return;
  }

  const user = await db.user.create({
    data: {
      clerkUserId: "demo-user",
      email: "demo@test.com",
    },
  });

  console.log("User created:", user);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());