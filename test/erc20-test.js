const { expect } = require("chai");
const { ethers } = require("hardhat");


let libraryToken;
let owner;
let addr1;
let addr2;


describe("OpenZeppelin ERC20 contract", function () {
  
  beforeEach(async function () {
    LToken = await ethers.getContractFactory("LToken");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    libraryToken = await LToken.deploy(100000);
  });

  describe("Deployment of LToken", function () {

    it("Should assign the total supply of tokens to the deployer", async function () {
      const ownerBalance = await libraryToken.balanceOf(owner.address);
      expect(await libraryToken.totalSupply()).to.equal(ownerBalance);
    });

  });
});