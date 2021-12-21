/* eslint-disable @typescript-eslint/no-var-requires */

const express = require("express");
const cron = require("node-cron");
const { providers, Contract, BigNumber } = require("ethers");
const { execSync } = require("child_process");

const LotteryConfig = require("./config.json");
const LotteryAbi = require("./abi/WagyuSwapLottery.json");

const networks = {
  testnet: {
    url: "https://testnet.velas.com/rpc/",
    chainId: 111,
  },
  mainnet: {
    url: "https://evmexplorer.velas.com/rpc",
    chainId: 106,
  },
};

const app = express();

const handleLottery = async (network) => {
  const networkInfo = networks[network];
  const provider = new providers.StaticJsonRpcProvider(networkInfo.url, networkInfo.chainId);
  const LotteryAddress = LotteryConfig.Lottery[network];
  console.log("handleLottery", network, LotteryAddress, "==at==", Date.now());
  if (LotteryAddress === "") {
    return;
  }

  const lotteryContract = new Contract(LotteryAddress, LotteryAbi, provider);

  try {
    const currentRoundId = await lotteryContract.viewCurrentLotteryId();
    if (currentRoundId.isZero()) {
      // startLottery
      execSync(`yarn execute:start:${network}`);
    } else {
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      const currentRoundInfo = await lotteryContract.viewLottery(currentRoundId);

      if (currentRoundInfo.status === 1) {
        // Open
        if (currentTimeStamp >= currentRoundInfo.endTime.toNumber()) {
          // closeLottery
          execSync(`yarn execute:close:${network}`);
          execSync(`yarn execute:draw:${network}`);
          execSync(`yarn execute:start:${network}`);
        }
      } else if (currentRoundInfo.status === 2) {
        execSync(`yarn execute:draw:${network}`);
        execSync(`yarn execute:start:${network}`);
      } else if (currentRoundInfo.status === 3) {
        execSync(`yarn execute:start:${network}`);
      }
    }
  } catch (error) {
    console.error("===error===", error);
  }
};

const startService = async () => {
  cron.schedule("0 */15 * * * *", () => {
    console.log("==cron==", Date.now());
    // run every 15 mins

    handleLottery("mainnet");
    handleLottery("testnet");
  });

  app.listen(3000, () => {
    console.log("====started===");
  });
};

startService();
