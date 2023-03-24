const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const {
  DAI,
  DAI_WHALE,
  POOL_ADDRESS_PROVIDER,
} = require("../hardhat-helper-config");

describe("Flash Loans", function () {
  let Flashloan;

  // Deploying Contract
  beforeEach(async function () {
    const ContractFactory = await ethers.getContractFactory("FlashLoanExample");
    Flashloan = await ContractFactory.deploy(POOL_ADDRESS_PROVIDER);
    await Flashloan.deployed();
  });

  it("Should take a flash loan and be able to return it", async function () {
    // Fetch the DAI smart contract
    const token = await ethers.getContractAt("IERC20", DAI);

    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");

    // Impersonating DAI WHALE
    const impersonatedDAISigner = await ethers.getImpersonatedSigner(DAI_WHALE);

    // Transferring DAI Token from DAI WHALE account to contract.
    await token
      .connect(impersonatedDAISigner)
      .transfer(Flashloan.address, BALANCE_AMOUNT_DAI);

    // Request and execute a flash loan of 10,000 DAI from Aave
    const txn = await Flashloan.createFlashLoan(DAI, 10000);
    await txn.wait();

    const remainingDai = await token.balanceOf(Flashloan.address);

    // Our remaining balance should be <2000 DAI we originally had, because we had to pay the premium
    expect(remainingDai.lt(BALANCE_AMOUNT_DAI)).to.equal(true);
  });
});
