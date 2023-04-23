const { expect } = require("chai");
const hre = require("hardhat")

async function getBlockTimestamp() {
  const blockNumber = await hre.ethers.provider.send('eth_blockNumber', [])
  const block = await hre.ethers.provider.send('eth_getBlockByNumber', [blockNumber, false])
  return parseInt(block.timestamp)
}

describe("TAI token", function () {
  let TAI;
  let tai;
  let owner;
  let addr1;
  let addr2;
  let uniswapPairSigner;


  beforeEach(async function () {
    TAI = await ethers.getContractFactory("TAI");
    [owner, addr1, addr2, uniswapPairSigner] = await ethers.getSigners();
    tai = await TAI.deploy();
    const amount = hre.ethers.utils.parseUnits('10', 9)
    await tai.transfer(uniswapPairSigner.address, amount)
    await tai.setUniswapPairAddress(uniswapPairSigner.address)
  });

  it("Non-whitelisted user cannot transfer before timeout", async function () {
    const amount = hre.ethers.utils.parseUnits('1', 9);

    await tai.connect(uniswapPairSigner).transfer(addr1.address, amount)
    await hre.ethers.provider.send("evm_mine", []);
    await expect(
      tai.connect(addr1).transfer(uniswapPairSigner.address, amount)
    ).to.be.revertedWith("lock 18s for prevent front runner bot.")
  });

  it("Non-whitelisted user can transfer after timeout", async function () {
    const amount = hre.ethers.utils.parseUnits('1', 9);

    const uniswapPairBeforeBalance = await tai.balanceOf(uniswapPairSigner.address)
    const senderBeforeBalance = await tai.balanceOf(addr1.address)

    await tai.connect(uniswapPairSigner).transfer(addr1.address, amount)
    const timestamp = await getBlockTimestamp()
    await hre.ethers.provider.send("evm_mine", [timestamp + 18]);
    await tai.connect(addr1).transfer(uniswapPairSigner.address, amount)

    expect((
      await tai.balanceOf(uniswapPairSigner.address
      ))).to.be.equal(uniswapPairBeforeBalance)

    expect((
      await tai.balanceOf(addr1.address)
    )).to.be.equal(senderBeforeBalance)

  });

  it("Whitelisted user can transfer before timeout", async function () {
    const amount = hre.ethers.utils.parseUnits('1', 9);

    const uniswapPairBeforeBalance = await tai.balanceOf(uniswapPairSigner.address)
    const senderBeforeBalance = await tai.balanceOf(addr2.address)
    await tai.addToWhitelist(addr2.address)
    await tai.connect(uniswapPairSigner).transfer(addr2.address, amount)
    await hre.ethers.provider.send("evm_mine", []);
    await tai.connect(addr2).transfer(uniswapPairSigner.address, amount)

    expect((
      await tai.balanceOf(uniswapPairSigner.address
      ))).to.be.equal(uniswapPairBeforeBalance)

    expect((
      await tai.balanceOf(addr2.address)
    )).to.be.equal(senderBeforeBalance)

  });

  it("Owner can set transfer timeout", async function () {
    const timeout = 20;

    const tx = await tai.setTransferTimeout(timeout);
    const receipt = await tx.wait()
    expect(receipt.status).to.equal(1)
    expect(await tai.transferTimeout()).to.equal(timeout);
  });

  it("Non-owner cannot set transfer timeout", async function () {
    const timeout = 20;

    await expect(tai.connect(addr1).setTransferTimeout(timeout)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Owner can add address to the whitelist", async function () {
    const addressToAdd = addr1.address;

    const tx = await tai.addToWhitelist(addressToAdd);
    const receipt = await tx.wait()
    expect(receipt.status).to.equal(1)

  });

  it("Non-owner cannot add address to the whitelist", async function () {
    const addressToAdd = addr1.address;

    await expect(tai.connect(addr1).addToWhitelist(addressToAdd)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Owner can remove address from the whitelist", async function () {
    const addressToRemove = addr1.address;

    await tai.addToWhitelist(addressToRemove);
    const tx = await tai.removeFromWhitelist(addressToRemove);
    const receipt = await tx.wait()
    expect(receipt.status).to.equal(1)
  });

  it("Non-owner cannot remove address from the whitelist", async function () {
    const addressToRemove = addr1.address;

    await tai.addToWhitelist(addressToRemove);
    await expect(tai.connect(addr1).removeFromWhitelist(addressToRemove)).to.be.revertedWith("Ownable: caller is not the owner");
  });
})
