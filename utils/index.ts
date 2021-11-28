import { parseEther } from "@ethersproject/units";
import axios from "axios";
import { BigNumber } from "ethers";
import moment from "moment";

/**
 * Get the ticket price, based on current network, as $Cake.
 * Used by 'start-lottery' Hardhat script, only.
 */
export const getTicketPrice = async (networkName: "testnet" | "mainnet", usd: number): Promise<BigNumber> => {
  const priceResponse = (
    await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=wagyuswap&vs_currencies=usd")
  ).data;
  const wagPrice = parseEther(String(priceResponse.wagyuswap.usd));

  return parseEther(usd.toString()).mul(parseEther("1")).div(wagPrice);
};

/**
 * Get the next lottery 'endTime', based on current date, as UTC.
 * Used by 'start-lottery' Hardhat script, only.
 */
export const getEndTime = (): number => {
  const currentTimeStamp = Math.floor(Date.now() / 1000);

  return currentTimeStamp + 12 * 3600;
};
