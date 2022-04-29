require("@nomiclabs/hardhat-waffle");

// This file specifies the basic hardhat config. Equivalent to the browinie-config.yaml file

// Here we export the version of solidity
// We also export the network that we use for this application
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/7019baad8dea4210b892c52f5eb604f7",
      accounts: ["ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"] 
    },
    // polygon: {
    //   url: "https://polygon-mainnet.infura.io/v3/7019baad8dea4210b892c52f5eb604f7",
    //   accounts: [process.env.pk] 
    // }
  }
};
