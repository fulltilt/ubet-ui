"use client";

import dynamic from "next/dynamic";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const Appbar = () => {
  const { publicKey, signMessage } = useWallet();

  const [openDisclaimer, setOpenDisclaimer] = useState(false);

  async function signAndSend() {
    if (!publicKey) {
      localStorage.removeItem("ub-token");
      return;
    }

    const message = `Sign into Ubet as a User: ${new Date(
      Date.now()
    ).toUTCString()}`;

    const encodedMessage = new TextEncoder().encode(message);
    let signature = await signMessage?.(encodedMessage);
    // console.log(signature);
    // console.log(publicKey);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
          publicKey: publicKey?.toString(),
          message,
        }),
      }
    );
    const res = await response.json();

    localStorage.setItem("ub-token", res.token);
  }

  useEffect(() => {
    signAndSend();
  }, [publicKey]);

  return (
    <>
      <div className="flex justify-between items-center border-b pb-2 pt-2">
        <div className="text-2xl pl-4">
          <Link href="/">UBet</Link>
        </div>
        <div className="flex items-center gap-4 text-xl pr-4">
          <Button onClick={() => setOpenDisclaimer(true)}>Disclaimer</Button>
          {publicKey ? (
            <WalletDisconnectButton />
          ) : (
            <WalletMultiButtonDynamic />
          )}
          <ThemeSwitcher />
        </div>
      </div>
      <AlertDialog open={openDisclaimer} onOpenChange={setOpenDisclaimer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disclaimer</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <p>
            This is all for play money on the Solana dev network. The way it
            works is that a User can propose to wager an amount to a bet which
            is a simple yes or no proposition. An end date and any contingencies
            are set by the creator of the Bet. Another User can take the
            opposite of the bet assuming both parties have enough SOL in their
            wallets.
          </p>
          <p>
            The winner is decided once both Users agree on who the winner is.
            This part is based on the honor system and Ubet will not be involved
            in this. Once the winner is determined, the wagered amount will be
            sent to the winners wallet minus a 5% SOL fee of the total wager. A
            bet can also end before the end date provided both Users agree and
            confirm on who the winner is.
          </p>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
