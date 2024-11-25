import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.POSTGRES_URL!,
    url: "postgresql://neondb_owner:I2ez6jgoqMTX@ep-fragrant-paper-a6w7fbu5.us-west-2.aws.neon.tech/neondb?sslmode=require",
  },
});
