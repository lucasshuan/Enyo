import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

async function checkRankings() {
  try {
    const rows = await sql`
      SELECT id, name, slug FROM rankings
    `;
    console.log("Rankings in DB:");
    console.table(rows);
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

checkRankings();
