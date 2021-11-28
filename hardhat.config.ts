import type { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: resolve(__dirname, "./.env") });

task("accounts", "Prints the list of accounts", async (args, { ethers }) => {
  const [operator] = await ethers.getSigners();

  console.log(`Operator address: ${operator.address}`);
});

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://testnet.velas.com/rpc/",
      chainId: 111,
      accounts: [process.env.OPERATOR_PRIVATE_KEY!],
    },
    mainnet: {
      url: "https://evmexplorer.velas.com/rpc",
      chainId: 106,
      accounts: [process.env.OPERATOR_PRIVATE_KEY!],
    },
  },
};

export default config;
