CREATE TABLE IF NOT EXISTS "bet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id1" text NOT NULL,
	"user_id2" text NOT NULL,
	"winner" text,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"end_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_bets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"bet" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bet" ADD CONSTRAINT "bet_user_id1_user_id_fk" FOREIGN KEY ("user_id1") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bet" ADD CONSTRAINT "bet_user_id2_user_id_fk" FOREIGN KEY ("user_id2") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bet" ADD CONSTRAINT "bet_winner_user_id_fk" FOREIGN KEY ("winner") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_bets" ADD CONSTRAINT "user_bets_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_bets" ADD CONSTRAINT "user_bets_bet_bet_id_fk" FOREIGN KEY ("bet") REFERENCES "public"."bet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
