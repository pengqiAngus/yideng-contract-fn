import { expect } from "chai";
import { ethers } from "hardhat";
import { YidengContract } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("YidengContract", function () {
  let contract: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const YidengContract = await ethers.getContractFactory("YidengContract");
    contract = await YidengContract.deploy("Yideng Token", "YDT", 18);
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await contract.name()).to.equal("Yideng Token");
      expect(await contract.symbol()).to.equal("YDT");
      expect(await contract.decimals()).to.equal(18);
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake ETH and receive tokens", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      await contract.connect(addr1).stakeEth({ value: stakeAmount });

      const expectedTokens = stakeAmount * 10000n;
      expect(await contract.balanceOf(addr1.address)).to.equal(expectedTokens);
    });

    it("Should calculate interest correctly", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      await contract.connect(addr1).stakeEth({ value: stakeAmount });

      // Fast forward time by 1 day
      await time.increase(86400);

      const expectedInterest = ((stakeAmount * 10000n) / 100n) * 1n;
      expect(await contract.calculateInterest(addr1.address)).to.equal(
        expectedInterest
      );
    });

    it("Should allow users to claim interest", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      await contract.connect(addr1).stakeEth({ value: stakeAmount });

      await time.increase(86400);

      const initialBalance = await contract.balanceOf(addr1.address);
      await contract.connect(addr1).claimInterest();
      const finalBalance = await contract.balanceOf(addr1.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Unstaking", function () {
    it("Should allow users to unstake tokens and receive ETH", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      await contract.connect(addr1).stakeEth({ value: stakeAmount });

      const tokenAmount = stakeAmount * 10000n;
      const initialBalance = await ethers.provider.getBalance(addr1.address);

      await contract.connect(addr1).unstake(tokenAmount);

      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Transfer", function () {
    it("Should transfer tokens between accounts", async function () {
      const stakeAmount = ethers.parseEther("1.0");
      await contract.connect(addr1).stakeEth({ value: stakeAmount });

      const transferAmount = stakeAmount * 5000n;
      await contract.connect(addr1).transfer(addr2.address, transferAmount);

      expect(await contract.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });
});
