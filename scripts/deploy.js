const hre = require("hardhat");
const fs = require("fs");

/**
 * Deploys the contract and prepare the config file to be utilized by the UI in the front end
 * 
 * 
 */
async function main() {
  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy("My Blog");
  await blog.deployed()
  console.log("Greeter deployed to:", blog.address);
  fs.writeFileSync('./config.js', `
    export const contractAddress = "${blog.address}"
    export const owner = "${blog.signer.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
