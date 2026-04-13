import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

async function checkColumns() {
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'rankings'
    `;
    console.log("Columns in 'rankings' table:");
    console.table(columns);
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

checkColumns();
