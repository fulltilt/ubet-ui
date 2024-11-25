import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

export const betEnum = pgEnum("bet_option", ["yes", "no"]);

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  address: text("address").notNull().unique(),
});

export const bet = pgTable("bet", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id1: text("user_id1")
    .notNull()
    .references(() => user.address, { onDelete: "cascade" }),
  user_id2: text("user_id2").references(() => user.address, {
    onDelete: "cascade",
  }),
  user1_bet: betEnum().notNull(),
  user1_txn_sig: text("user1_txn_sig"),
  user2_txn_sig: text("user2_txn_sig"),
  user2_bet: betEnum(),
  winner: text("winner").references(() => user.address, {
    onDelete: "cascade",
  }),
  amount: integer("amount").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  end_at: timestamp("end_at", { withTimezone: true, mode: "string" }),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const user_bets = pgTable("user_bets", {
  id: serial("id").primaryKey(),
  user: text("user")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  bet: text("bet")
    .notNull()
    .references(() => bet.id, { onDelete: "cascade" }),
});
