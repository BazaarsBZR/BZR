javascript
// test/BZR.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("BZR Token", function () {
  // Fixture for deployment
  async function deployBZRFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    const BZR = await ethers.getContractFactory("BZR");
    const totalSupply = ethers.parseEther("55555555.555555555555555555");
    const bzr = await BZR.deploy(owner.address, totalSupply);
    
    return { bzr, owner, addr1, addr2, addr3, totalSupply };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      expect(await bzr.name()).to.equal("Bazaars");
      expect(await bzr.symbol()).to.equal("BZR");
    });

    it("Should assign the total supply to the deployer", async function () {
      const { bzr, owner, totalSupply } = await loadFixture(deployBZRFixture);
      expect(await bzr.balanceOf(owner.address)).to.equal(totalSupply);
    });

    it("Should set correct decimals", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      expect(await bzr.decimals()).to.equal(18);
    });

    it("Should set correct initial supply", async function () {
      const { bzr, totalSupply } = await loadFixture(deployBZRFixture);
      expect(await bzr.INITIAL_SUPPLY()).to.equal(totalSupply);
      expect(await bzr.totalSupply()).to.equal(totalSupply);
    });

    it("Should fail if deployer is zero address", async function () {
      const BZR = await ethers.getContractFactory("BZR");
      const totalSupply = ethers.parseEther("55555555.555555555555555555");
      await expect(
        BZR.deploy(ethers.ZeroAddress, totalSupply)
      ).to.be.revertedWithCustomError(BZR, "ZeroAddress");
    });

    it("Should fail if initial supply is zero", async function () {
      const [owner] = await ethers.getSigners();
      const BZR = await ethers.getContractFactory("BZR");
      await expect(
        BZR.deploy(owner.address, 0)
      ).to.be.revertedWithCustomError(BZR, "ZeroAmount");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { bzr, owner, addr1, addr2 } = await loadFixture(deployBZRFixture);
      const amount = ethers.parseEther("50");

      await expect(
        bzr.connect(owner).transfer(addr1.address, amount)
      ).to.changeTokenBalances(bzr, [owner, addr1], [-amount, amount]);

      await expect(
        bzr.connect(addr1).transfer(addr2.address, amount)
      ).to.changeTokenBalances(bzr, [addr1, addr2], [-amount, amount]);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      const initialBalance = await bzr.balanceOf(owner.address);

      await expect(
        bzr.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(bzr, "ERC20InsufficientBalance");
    });

    it("Should update balances after transfers", async function () {
      const { bzr, owner, addr1, addr2 } = await loadFixture(deployBZRFixture);
      const amount = ethers.parseEther("100");

      await bzr.transfer(addr1.address, amount);
      await bzr.connect(addr1).transfer(addr2.address, amount);

      expect(await bzr.balanceOf(addr2.address)).to.equal(amount);
    });
  });

  describe("Approvals", function () {
    it("Should approve tokens for delegated transfer", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      const amount = ethers.parseEther("100");

      await bzr.approve(addr1.address, amount);
      expect(await bzr.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should require zeroing allowance before changing non-zero to non-zero", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      
      await bzr.approve(addr1.address, ethers.parseEther("100"));
      
      await expect(
        bzr.approve(addr1.address, ethers.parseEther("200"))
      ).to.be.revertedWithCustomError(bzr, "MustZeroAllowanceFirst");
    });

    it("Should allow setting allowance to zero then to new value", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      
      await bzr.approve(addr1.address, ethers.parseEther("100"));
      await bzr.approve(addr1.address, 0);
      await bzr.approve(addr1.address, ethers.parseEther("200"));
      
      expect(await bzr.allowance(owner.address, addr1.address)).to.equal(ethers.parseEther("200"));
    });

    it("Should not allow approve to zero address", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      
      await expect(
        bzr.approve(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(bzr, "ApproveToZeroAddress");
    });
  });

  describe("TransferFrom", function () {
    it("Should transfer tokens from one account to another with approval", async function () {
      const { bzr, owner, addr1, addr2 } = await loadFixture(deployBZRFixture);
      const amount = ethers.parseEther("100");

      await bzr.approve(addr1.address, amount);
      
      await expect(
        bzr.connect(addr1).transferFrom(owner.address, addr2.address, amount)
      ).to.changeTokenBalances(bzr, [owner, addr2], [-amount, amount]);

      expect(await bzr.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it("Should fail if spender doesn't have approval", async function () {
      const { bzr, owner, addr1, addr2 } = await loadFixture(deployBZRFixture);
      
      await expect(
        bzr.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(bzr, "ERC20InsufficientAllowance");
    });
  });

  describe("Increase/Decrease Allowance", function () {
    it("Should increase allowance", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      const initialAmount = ethers.parseEther("100");
      const addedAmount = ethers.parseEther("50");

      await bzr.approve(addr1.address, initialAmount);
      await bzr.increaseAllowance(addr1.address, addedAmount);

      expect(await bzr.allowance(owner.address, addr1.address)).to.equal(
        initialAmount + addedAmount
      );
    });

    it("Should decrease allowance", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      const initialAmount = ethers.parseEther("100");
      const subtractedAmount = ethers.parseEther("50");

      await bzr.approve(addr1.address, initialAmount);
      await bzr.decreaseAllowance(addr1.address, subtractedAmount);

      expect(await bzr.allowance(owner.address, addr1.address)).to.equal(
        initialAmount - subtractedAmount
      );
    });

    it("Should fail when decreasing allowance below zero", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      
      await bzr.approve(addr1.address, ethers.parseEther("100"));
      
      await expect(
        bzr.decreaseAllowance(addr1.address, ethers.parseEther("200"))
      ).to.be.revertedWithCustomError(bzr, "AllowanceUnderflow");
    });
  });

  describe("Burn Functions", function () {
    it("Should burn tokens and reduce total supply", async function () {
      const { bzr, owner, totalSupply } = await loadFixture(deployBZRFixture);
      const burnAmount = ethers.parseEther("1000");

      await expect(bzr.burn(burnAmount))
        .to.emit(bzr, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await bzr.totalSupply()).to.equal(totalSupply - burnAmount);
      expect(await bzr.balanceOf(owner.address)).to.equal(totalSupply - burnAmount);
    });

    it("Should track total burned amount", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      const burnAmount = ethers.parseEther("1000");

      expect(await bzr.totalBurned()).to.equal(0);
      
      await bzr.burn(burnAmount);
      expect(await bzr.totalBurned()).to.equal(burnAmount);
      
      await bzr.burn(burnAmount);
      expect(await bzr.totalBurned()).to.equal(burnAmount * 2n);
    });

    it("Should burn tokens from allowance", async function () {
      const { bzr, owner, addr1, totalSupply } = await loadFixture(deployBZRFixture);
      const burnAmount = ethers.parseEther("1000");

      await bzr.approve(addr1.address, burnAmount);
      
      await expect(bzr.connect(addr1).burnFrom(owner.address, burnAmount))
        .to.emit(bzr, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await bzr.totalSupply()).to.equal(totalSupply - burnAmount);
      expect(await bzr.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it("Should fail to burn more than balance", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      const balance = await bzr.balanceOf(addr1.address);

      await expect(
        bzr.connect(addr1).burn(balance + 1n)
      ).to.be.revertedWithCustomError(bzr, "ERC20InsufficientBalance");
    });
  });

  describe("View Functions", function () {
    it("Should return correct circulating supply", async function () {
      const { bzr, totalSupply } = await loadFixture(deployBZRFixture);
      const burnAmount = ethers.parseEther("1000");

      expect(await bzr.circulatingSupply()).to.equal(totalSupply);
      
      await bzr.burn(burnAmount);
      expect(await bzr.circulatingSupply()).to.equal(totalSupply - burnAmount);
    });

    it("Should return correct initial supply", async function () {
      const { bzr, totalSupply } = await loadFixture(deployBZRFixture);
      
      await bzr.burn(ethers.parseEther("1000"));
      
      expect(await bzr.initialSupply()).to.equal(totalSupply);
      expect(await bzr.INITIAL_SUPPLY()).to.equal(totalSupply);
    });

    it("Should return correct token stats", async function () {
      const { bzr, totalSupply } = await loadFixture(deployBZRFixture);
      const burnAmount = ethers.parseEther("5555555.555555555555555555"); // 10%

      await bzr.burn(burnAmount);
      
      const stats = await bzr.getTokenStats();
      expect(stats.initialSupplyValue).to.equal(totalSupply);
      expect(stats.currentSupply).to.equal(totalSupply - burnAmount);
      expect(stats.burnedTokens).to.equal(burnAmount);
      expect(stats.burnRate).to.equal(1000); // 10% = 1000 basis points
    });

    it("Should calculate burn rate with custom precision", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      const burnAmount = ethers.parseEther("5555555.555555555555555555"); // 10%

      await bzr.burn(burnAmount);
      
      expect(await bzr.getBurnRate(100)).to.equal(10); // 10%
      expect(await bzr.getBurnRate(1000)).to.equal(100); // 10.0%
      expect(await bzr.getBurnRate(10000)).to.equal(1000); // 10.00%
    });

    it("Should return correct chain name", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      
      expect(await bzr.getChainName(1)).to.equal("Ethereum");
      expect(await bzr.getChainName(56)).to.equal("BNB Chain");
      expect(await bzr.getChainName(137)).to.equal("Polygon");
      expect(await bzr.getChainName(999999)).to.equal("Unsupported Chain");
    });

    it("Should identify as BZR token", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      expect(await bzr.isBZR()).to.equal(true);
    });

    it("Should return correct version", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      expect(await bzr.version()).to.equal("5.5");
    });
  });

  describe("ERC-5267 Metadata", function () {
    it("Should return correct contract metadata", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      const metadata = await bzr.getContractMetadata();

      expect(metadata.tokenName).to.equal("Bazaars");
      expect(metadata.versionString).to.equal("5.5");
      expect(metadata.standard).to.equal("ORC-55");
      expect(metadata.features).to.include.members([
        "Final",
        "OpenZeppelin-ReentrancyGuard",
        "Deflationary",
        "ORC-55",
        "ERC20Burnable",
        "Race-Condition-Safe",
        "Multi-Chain-Ready"
      ]);
    });
  });

  describe("Interface Support", function () {
    it("Should support expected interfaces", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      
      // ERC165
      expect(await bzr.supportsInterface("0x01ffc9a7")).to.equal(true);
      
      // ERC20 (we need to calculate the actual interface ID)
      // This is a simplified check - in reality you'd calculate the proper interface ID
      expect(await bzr.supportsInterface("0x36372b07")).to.equal(true);
      
      // ERC20Burnable
      expect(await bzr.supportsInterface("0x3b5a0bf8")).to.equal(true);
    });
  });

  describe("Multi-chain Info", function () {
    it("Should return deployment info", async function () {
      const { bzr, totalSupply } = await loadFixture(deployBZRFixture);
      const info = await bzr.getDeploymentInfo();

      expect(info.deploymentTime).to.be.gt(0);
      expect(info.chainId).to.equal(31337); // Hardhat chainId
    });

    it("Should return multi-chain info", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      const info = await bzr.getMultiChainInfo();

      expect(info.currentChainId).to.equal(31337);
      expect(info.totalChains).to.equal(1); // Only deployed on test chain
      expect(info.allChains).to.have.lengthOf(1);
    });
  });

  describe("Gas Usage", function () {
    it("Should have reasonable gas costs for transfers", async function () {
      const { bzr, owner, addr1 } = await loadFixture(deployBZRFixture);
      const amount = ethers.parseEther("100");

      const tx = await bzr.transfer(addr1.address, amount);
      const receipt = await tx.wait();
      
      // Standard ERC20 transfer should be under 65,000 gas
      expect(receipt.gasUsed).to.be.lt(65000);
    });

    it("Should have reasonable gas costs for burns", async function () {
      const { bzr } = await loadFixture(deployBZRFixture);
      const amount = ethers.parseEther("100");

      const tx = await bzr.burn(amount);
      const receipt = await tx.wait();
      
      // Burn should be under 35,000 gas
      expect(receipt.gasUsed).to.be.lt(35000);
    });
  });
});
Run Tests


bash
# Run all tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run specific test
npx hardhat test test/BZR.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
This comprehensive test suite covers all major functionality of the BZR token contract including deployment, transfers, approvals, burns, and special features.
