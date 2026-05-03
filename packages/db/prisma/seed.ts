import { prisma } from "../index";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const GAMES_TO_SEED = [
  {
    name: "Superfighters Deluxe",
    slug: "superfighters-deluxe",
    description:
      "Superfighters Deluxe is a unique action game that combines brawling, shooting and platforming in dynamic sandboxy 2D levels. Lots of weapons and fun gameplay systems interlock to create absurd action-movie chaos.",
    thumbnailImagePath:
      "games/cmo6216sl00002svwl7pqcsbn/thumbnail-5963c137-431e-4e68-b22f-320fd8eddfdd.jpg",
    backgroundImagePath:
      "games/cmo6216sl00002svwl7pqcsbn/background-770cd8d3-d103-49af-923c-37acaad9f1b8.jpg",
    steamUrl: "https://store.steampowered.com/app/855860/Superfighters_Deluxe/",
  },
  {
    name: "Rocket League",
    slug: "rocket-league",
    description:
      "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition. Rocket League includes casual and competitive Online Matches, a fully-featured offline Season Mode, special “Mutators” that let you change the rules entirely, hockey and basketball-inspired Extra Modes, and more than 500 trillion possible cosmetic customization combinations.",
    thumbnailImagePath:
      "games/cmo6217h600012svwyjrda8ji/thumbnail-85304b72-1166-4ba5-a204-a1f555eb00f0.jpg",
    backgroundImagePath:
      "games/cmo6217h600012svwyjrda8ji/background-0455f5ea-30a0-48ea-92f3-7d49ca8ba23e.jpg",
    steamUrl: "https://store.steampowered.com/app/252950/Rocket_League/",
  },
];

async function seedGames() {
  console.log("Seeding games...");
  for (const game of GAMES_TO_SEED) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        description: game.description,
        thumbnailImagePath: game.thumbnailImagePath,
        backgroundImagePath: game.backgroundImagePath,
        steamUrl: game.steamUrl,
      },
      create: {
        name: game.name,
        slug: game.slug,
        description: game.description,
        thumbnailImagePath: game.thumbnailImagePath,
        backgroundImagePath: game.backgroundImagePath,
        steamUrl: game.steamUrl,
      },
    });
  }
  console.log("Games seeded.");
}

async function main() {
  try {
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
