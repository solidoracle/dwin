import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";



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
  },
};

export default config;
