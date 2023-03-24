require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: POLYGON_MAINNET_RPC_URL,
      },
    },
  },
  solidity: "0.8.10",
};
