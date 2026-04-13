import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

async function checkGameId() {
  try {
    const rows = await sql`
      SELECT r.slug as ranking_slug, g.slug as game_slug 
      FROM rankings r 
      JOIN games g ON r.game_id = g.id 
      WHERE r.slug = 'sa'
    `;
    console.log("Ranking-Game Relation:");
    console.table(rows);
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

checkGameId();
