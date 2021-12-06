require("@nomiclabs/hardhat-ethers");
require('dotenv').config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {
      chainId: 1337
    },
    matic: {
      url: "https://polygon-rpc.com/",
      accounts: [PRIVATE_KEY],
    }
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
}