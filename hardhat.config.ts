import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    hardhat: {
      accounts: {
        count: 300,
      },
    },
    // Uncomment the following lines and create a .env file containing
    // ALCHEMY_API_KEY="" and GOERLI_PRIVATE_KEY=""
    // goerli: {
    //   url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    //   accounts: [String(process.env.GOERLI_PRIVATE_KEY)]
    // }
  },
};

export default config;
