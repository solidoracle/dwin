import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import { Wallet } from "ethers";



dotenv.config();

// Defining this manually since ethers cannot be access from within the hardhat config
const hashZero =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    hardhat: {
      accounts: {
        count: 300,
      },
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [String(process.env.GOERLI_PRIVATE_KEY)]
    }
  },
};

export default config;
