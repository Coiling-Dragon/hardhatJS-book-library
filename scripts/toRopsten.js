const hre = require("hardhat");
const ethers = hre.ethers;

async function deployLToken(wallet) {

  const LToken = await ethers.getContractFactory("LToken", wallet);

  const LTokenContract = await LToken.deploy(1000);
  console.log("Waiting for LToken deployment...");
  await LTokenContract.deployed();

  console.log("LToken Contract address: ", LTokenContract.address);
  console.log("Done!");
  console.log("Account balance:", (await wallet.getBalance()).toString());

  return LTokenContract.address
}

async function deployBooks(wallet,LTokenAdress){
  const BooksLibrary = await ethers.getContractFactory("BookLibrary", wallet);
  const BooksLibraryContract = await BooksLibrary.deploy(LTokenAdress);
  console.log("Waiting for BooksLibrary deployment...");
  await BooksLibraryContract.deployed();

  console.log("BooksLibrary Contract address: ", BooksLibraryContract.address);
  console.log("Done!");
  console.log("Account balance:", (await wallet.getBalance()).toString());

  return BooksLibraryContract.address
}


async function deployLibrary(_privateKey) {
  console.log(_privateKey)
  await hre.run("compile");
  const wallet = new ethers.Wallet(_privateKey, hre.ethers.provider); // New wallet with the privateKey passed from CLI as param
  console.log("Deploying contracts with the account:", wallet.address); // We are printing the address of the deployer
  console.log("Account balance:", (await wallet.getBalance()).toString()); // We are printing the account balance

  const LTokenAdress = await deployLToken(wallet) // '0xc240F95B116845AA2d5703be251eAC2807c1f11E' 
  await deployBooks(wallet,LTokenAdress) // '0x8798749F7130F4D1a9Cd3Fe14d65dFa9e7aCd8B7'
}

module.exports = deployLibrary;
