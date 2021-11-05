const hre = require("hardhat");
const ethers = hre.ethers;

async function verifying() {
  const LTokenAddress = "0xc240F95B116845AA2d5703be251eAC2807c1f11E";
  const BookLibraryAddress = "0x8798749F7130F4D1a9Cd3Fe14d65dFa9e7aCd8B7";

  console.log("now verifying ltokens...");
  await hre.run("verify:verify", {
    contract: 'contracts/LToken.sol:LToken',
    address: LTokenAddress,
    constructorArguments: [1000],
  });

  console.log("now verifying books...");
  await hre.run("verify:verify", {
    address: BookLibraryAddress,
    constructorArguments: [LTokenAddress],
  });
  console.log("now verifying books...");
}

module.exports =  verifying;
