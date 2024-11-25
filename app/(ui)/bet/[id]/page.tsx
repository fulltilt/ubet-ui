"use client";

import { BetType } from "@/app/types";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { acceptBet, getBet, getUSDToSOL } from "@/app/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { capitalizeWord, truncateByDecimalPlace } from "@/app/utils";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import Link from "next/link";

const BetUIComponent = () => {
  const { id } = useParams();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();

  const {
    data: betData,
    error: betError,
    isLoading: isBetLoading,
  } = useQuery<BetType>({
    queryKey: ["getBet"],
    queryFn: () => getBet(id as string),
  });

  const { data: USDToSOL } = useQuery<number>({
    queryKey: ["getUSDToSOL"],
    queryFn: getUSDToSOL,
  });

  if (isBetLoading) return <div>Loading...</div>;

  const {
    title,
    amount,
    end_at,
    user_id1,
    user1_bet,
    user_id2,
    user2_bet,
    winner,
    description,
    user1_txn_sig,
    user2_txn_sig,
  } = betData[0];

  const onSubmitBet = async () => {
    if (!USDToSOL) return;

    const publicKey1 = new PublicKey(user_id1);
    const publicKey2 = new PublicKey(publicKey?.toBase58() as string);

    const user1Balance =
      (await connection.getBalance(publicKey1)) / LAMPORTS_PER_SOL;
    const user2Balance =
      (await connection.getBalance(publicKey2)) / LAMPORTS_PER_SOL;

    const requiredSOL = truncateByDecimalPlace(amount / USDToSOL, 2);

    if (user1Balance < requiredSOL)
      toast({
        title: "Other User does not have enough SOL to complete this bet.",
      });
    if (user2Balance < requiredSOL)
      toast({
        title: "You do not have enough SOL to complete this bet.",
      });

    try {
      const lamportsToSend = Math.ceil((amount / USDToSOL!) * LAMPORTS_PER_SOL);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey(process.env.NEXT_PUBLIC_PARENT_WALLET!),
          lamports: lamportsToSend,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      const transactionConfirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      const response = await acceptBet(
        id as string,
        publicKey!.toBase58(),
        signature
      );
      if (response.status === 403) {
        toast({
          title: "Error Accepting Bet",
        });
      }

      const res = await response.json();

      toast({
        title: "Successfully Accepted Bet!",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error Accepting Bet",
      });
    }
  };

  return (
    <div className="max-w-7xl mt-20 mx-80">
      <div className="mb-4">
        <h1 className="font-bold text-3xl">{title}</h1>
        <p>{description}</p>
        <h3 className="text-lg font-semibold mt-8">Bet Ends:</h3>
        <p>{new Date(end_at).toLocaleString()}</p>
        <h3 className="text-lg font-semibold mt-8">Amount:</h3>
        <p>
          ${amount} (
          {USDToSOL ? `${truncateByDecimalPlace(amount / USDToSOL, 2)}` : ""}{" "}
          SOL)
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Bettor Stats:</h3>

        <div className="flex items-center space-x-4 mb-2">
          <Avatar>
            <AvatarImage src={""} alt={user_id1} />
            <AvatarFallback>{user_id1.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user_id1}</p>
            <p className="text-sm text-gray-400">
              Bet: {capitalizeWord(user1_bet)}{" "}
              <Link
                href={`https://explorer.solana.com/tx/${user1_txn_sig}?cluster=devnet`}
                target="_blank"
                className="text-blue-400"
              >
                (Proof of payment)
              </Link>
            </p>
          </div>
        </div>
        {user_id2 ? (
          <div className="flex items-center space-x-4 mb-2">
            <Avatar>
              <AvatarImage src={""} alt={user_id2} />
              <AvatarFallback>{user_id2?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user_id2}</p>
              <p className="text-sm text-gray-400">
                Bet: {capitalizeWord(user2_bet)}{" "}
                <Link
                  href={`https://explorer.solana.com/tx/${user2_txn_sig}?cluster=devnet`}
                  target="_blank"
                  className="text-blue-400"
                >
                  (Proof of payment)
                </Link>
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8 w-full">
        {(publicKey?.toBase58() === user_id1 ||
          publicKey?.toBase58() === user_id2) &&
          user_id2 && <Button className="w-full">Mark Winner</Button>}
        {user_id2 === null &&
          publicKey &&
          user_id1 !== publicKey?.toBase58() && (
            <Button className="w-full" onClick={onSubmitBet}>
              Bet {user1_bet === "yes" ? "No" : "Yes"}
            </Button>
          )}
      </div>
    </div>
  );
};

export default BetUIComponent;
