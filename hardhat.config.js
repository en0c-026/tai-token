require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const privateKey = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.0",
  networks: {
    bsc: {
      url: "https://rpc.ankr.com/bsc",
      accounts: [privateKey]
    },
    bscTestnet: {
      url: "https://bsc-testnet.public.blastapi.io	",
      accounts: [privateKey]
    }
  }
};
