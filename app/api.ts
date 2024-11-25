export const getBets = async () =>
  (
    await (
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/bet/all/open`)
    ).json()
  ).data;

export const getBet = async (id: string) =>
  (
    await (
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/bet/${id}`)
    ).json()
  ).data;

export const getUSDToSOL = async () =>
  (
    await (
      await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      )
    ).json()
  ).solana.usd;

export const createBet = async (
  publicKey: string,
  title: string,
  description: string,
  amount: number,
  endDate: Date,
  bet: string,
  signature: string
) => {
  return await (
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/bet`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("ub-token") ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user1: publicKey,
        user1_bet: bet,
        amount,
        title,
        description,
        endDate,
        signature,
      }),
    })
  ).json();
};

export const acceptBet = async (
  id: string,
  publicKey: string,
  signature: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/bet/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("ub-token") ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user2: publicKey,
        signature,
      }),
    }
  );

  return response;
};
