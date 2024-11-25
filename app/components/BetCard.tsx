"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BetType } from "../types";
import { useState } from "react";
import Link from "next/link";
// import { acceptBet } from "../api";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import {
//   LAMPORTS_PER_SOL,
//   PublicKey,
//   SystemProgram,
//   Transaction,
// } from "@solana/web3.js";
// import { acceptBet } from "../api";

export function BetCard({
  bet,
  publicKey,
}: // refetchGetBets,
{
  bet: BetType;
  publicKey: string | undefined;
  // refetchGetBets: () => void;
}) {
  // const { toast } = useToast();
  // const { sendTransaction } = useWallet();
  // const { connection } = useConnection();

  const [openDialog, setOpenDialog] = useState(false);
  const [messageApproved] = useState(true);

  // const submitBet = async () => {
  //   return;
  //   if (!publicKey) {
  //     setOpenDialog(true);
  //     return;
  //   }

  //   try {
  //     const lamportsToSend = Math.ceil((amount / USDToSOL!) * LAMPORTS_PER_SOL);
  //     const transaction = new Transaction().add(
  //       SystemProgram.transfer({
  //         fromPubkey: publicKey!,
  //         toPubkey: new PublicKey(process.env.NEXT_PUBLIC_PARENT_WALLET!),
  //         lamports: lamportsToSend,
  //       })
  //     );
  //     const {
  //       context: { slot: minContextSlot },
  //       value: { blockhash, lastValidBlockHeight },
  //     } = await connection.getLatestBlockhashAndContext();
  //     const signature = await sendTransaction(transaction, connection, {
  //       minContextSlot,
  //     });

  //     await connection.confirmTransaction({
  //       blockhash,
  //       lastValidBlockHeight,
  //       signature,
  //     });
  //     const response = await acceptBet(bet.id, publicKey, signature);
  //     if (response.status === 403) {
  //       setMessageApproved(false);
  //       setOpenDialog(true);
  //     }
  //     setMessageApproved(true);
  //     refetchGetBets();
  //     await response.json();
  //     toast({
  //       title: "Successfully Accepted Bet!",
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <>
      <Card className="w-full max-w-80 dark:bg-[#2C3F4F]">
        <CardHeader className="h-[30%]">
          <CardTitle className="text-lg">
            <Link href={`/bet/${bet.id}`}>{bet.title}</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-end space-y-4 h-[50%]">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">${bet.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ends</span>
            <span className="font-medium">
              {new Date(bet.end_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
        <CardFooter className="h-[20%]">
          <Button className="w-full" onClick={() => setOpenDialog(!openDialog)}>
            Bet {bet.user1_bet === "yes" ? "No" : "Yes"}
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publicKey
                ? messageApproved
                  ? "Are you absolutely sure you want to accept this bet?"
                  : "Approve message in wallet to proceed."
                : "Please log into a wallet to proceed with bet."}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {publicKey
                ? messageApproved
                  ? "All bets are final and this action cannot be undone. You can also click on title to get more details on this Bet."
                  : ""
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {publicKey ? "Cancel" : "Close"}
            </AlertDialogCancel>
            {publicKey ? (
              messageApproved ? (
                <AlertDialogAction>
                  <Link href={`/bet/${bet.id}`}>Continue</Link>
                </AlertDialogAction>
              ) : null
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
