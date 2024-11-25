// import { drizzle } from "drizzle-orm/neon-http";

// export const db = drizzle(process.env.POSTGRES_URL!);

// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";

// const sql = neon(process.env.DATABASE_URL!);
// const db = drizzle({ client: sql });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
const sql = neon(
  "postgresql://neondb_owner:I2ez6jgoqMTX@ep-fragrant-paper-a6w7fbu5.us-west-2.aws.neon.tech/neondb?sslmode=require"
);

import * as schema from "./schema";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });
