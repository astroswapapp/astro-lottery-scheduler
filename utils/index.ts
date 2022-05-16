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
    await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=astroswap&vs_currencies=usd")
  ).data;
  const astroPrice = parseEther(String(priceResponse.astroswap.usd));

  return parseEther(usd.toString()).mul(parseEther("1")).div(astroPrice);
};

/**
 * Get the next lottery 'endTime', based on current date, as UTC.
 * Used by 'start-lottery' Hardhat script, only.
 */
export const getEndTime = (): number => {
  // 8pm utc every Sunday
  const date = new Date();

  const dayDiff = 7 - date.getDay();
  date.setDate(date.getDate() + dayDiff);
  date.setHours(20);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return Math.floor(date.getTime() / 1000);
};
