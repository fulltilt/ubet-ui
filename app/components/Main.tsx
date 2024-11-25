"use client";

import { BetType } from "../types";
import { BetCard } from "./BetCard";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { createBet, getBets, getUSDToSOL } from "../api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  bet: z.string(),
  description: z.string().min(10, "Description should be longer"),
  amount: z.coerce
    .number()
    .nonnegative()
    .min(1, "Amount must be greater than 0"),
  endDate: z.string().pipe(z.coerce.date()),
});

const Main = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      bet: "yes",
      description: "",
      amount: 1,
      endDate: new Date(),
    },
  });

  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: betsData,
    isLoading: isBetsLoading,
    refetch: refetchGetBets,
  } = useQuery<BetType[]>({
    queryKey: ["getBets"],
    queryFn: getBets,
  });

  const { data: USDToSOL } = useQuery<number>({
    queryKey: ["getUSDToSOL"],
    queryFn: getUSDToSOL,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { title, description, amount, endDate, bet } = data;
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

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      await createBet(
        publicKey?.toString() ?? "",
        title,
        description,
        amount,
        endDate,
        bet,
        signature
      );

      setOpenDialog(false);
      toast({
        title: "Successfully Created Bet!",
      });

      refetchGetBets();
      // console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mx-4">
      <Button onClick={() => setOpenDialog(true)}>New Bet</Button>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 mb-32 max-w-7xl mx-auto">
        {isBetsLoading ? (
          <div>
            {/* {Array(9)
              .fill(1)
              .map((_, idx) => (
                <SkeletonCard key={idx} />
              ))} */}
            Loading...
          </div>
        ) : (
          betsData?.map((bet: BetType, idx: number) => (
            <BetCard
              key={idx}
              bet={bet}
              publicKey={publicKey?.toBase58()}
              // refetchGetBets={refetchGetBets}
            />
          ))
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Bet</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {!publicKey ? (
            <p>Please log into a Wallet to enter a bet</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-8 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bet</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="yes" />
                              <Label htmlFor="yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="no" />
                              <Label htmlFor="no">No</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            id="description"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            id="amount"
                            type="number"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            id="endDate"
                            type="date"
                            className="col-span-3"
                            min={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Submit Bet</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Main;
