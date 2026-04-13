import fs from "fs";
import path from "path";

const rankingsPath = "src/app/[locale]/games/[gameSlug]/rankings";

try {
  const files = fs.readdirSync(rankingsPath);
  console.log("Folders in rankings path:");
  console.log(files);
} catch (err) {
  console.error(err);
}
