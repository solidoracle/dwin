import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";


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
      // gasPrice: 0,
    },
  },
};

export default config;
