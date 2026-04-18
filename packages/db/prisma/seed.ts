import { prisma } from "../index";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const INITIAL_PERMISSION_DEFINITIONS = [
  { key: "manage_games", name: "Manage Games" },
  { key: "manage_players", name: "Manage Players" },
  { key: "manage_events", name: "Manage Events" },
  { key: "manage_users", name: "Manage Users" },
] as const;

const GAMES_TO_SEED = [
  {
    name: "Superfighters Deluxe",
    slug: "superfighters-deluxe",
    description:
      "Superfighters Deluxe is a unique action game that combines brawling, shooting and platforming in dynamic sandboxy 2D levels. Lots of weapons and fun gameplay systems interlock to create absurd action-movie chaos.",
    thumbnailImageUrl:
      "https://dcoboi83hxoar.cloudfront.net/uploads/406f2c2e-2730-425f-9736-119a12c7d4ad.jpg",
    backgroundImageUrl:
      "https://dcoboi83hxoar.cloudfront.net/uploads/72b2fefd-57c7-4212-86c1-edb2d559ac4c.jpg",
    steamUrl: "https://store.steampowered.com/app/855860/Superfighters_Deluxe/",
  },
  {
    name: "Rocket League",
    slug: "rocket-league",
    description:
      "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition. Rocket League includes casual and competitive Online Matches, a fully-featured offline Season Mode, special “Mutators” that let you change the rules entirely, hockey and basketball-inspired Extra Modes, and more than 500 trillion possible cosmetic customization combinations.",
    thumbnailImageUrl:
      "https://dcoboi83hxoar.cloudfront.net/uploads/5f54b3b0-f4f2-463f-8cd9-52e4bed66ccf.jpg",
    backgroundImageUrl:
      "https://dcoboi83hxoar.cloudfront.net/uploads/7e77f9cb-fada-4fea-9631-9216a7cf39c1.jpg",
    steamUrl: "https://store.steampowered.com/app/252950/Rocket_League/",
  },
];

async function seedPermissions() {
  console.log("Seeding permissions...");
  for (const definition of INITIAL_PERMISSION_DEFINITIONS) {
    await prisma.permission.upsert({
      where: { key: definition.key },
      update: { name: definition.name },
      create: {
        key: definition.key,
        name: definition.name,
      },
    });
  }
  console.log("Permissions seeded.");
}

async function seedGames() {
  console.log("Seeding games...");
  for (const game of GAMES_TO_SEED) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        description: game.description,
        thumbnailImageUrl: game.thumbnailImageUrl,
        backgroundImageUrl: game.backgroundImageUrl,
        steamUrl: game.steamUrl,
      },
      create: {
        name: game.name,
        slug: game.slug,
        description: game.description,
        thumbnailImageUrl: game.thumbnailImageUrl,
        backgroundImageUrl: game.backgroundImageUrl,
        steamUrl: game.steamUrl,
      },
    });
  }
  console.log("Games seeded.");
}

async function main() {
  try {
    await seedPermissions();
    await seedGames();
    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
