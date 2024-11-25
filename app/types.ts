import { z } from "zod";

export const betSchema = z.object({
  amount: z.number(),
  created_at: z.string(),
  description: z.string(),
  end_at: z.string(),
  id: z.string(),
  title: z.string(),
  updated_at: z.string(),
  user_id1: z.string(),
  user_id2: z.string(),
  user1_bet: z.string(),
  user2_bet: z.string(),
  winner: z.string(),
  user1_txn_sig: z.string(),
  user2_txn_sig: z.string(),
});

export type BetType = z.infer<typeof betSchema>;
