// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const TAI = await hre.ethers.getContractFactory("TAI");
  const tai = TAI.attach("0x0036fdA624071f0756237198018aCF0C2D74c3f1")
  const amount = hre.ethers.utils.parseUnits('10', 9)
  const tx = await tai.transfer('0xc98875B3e8f6650c5a3F3b11F1D1ab8e77BFd0F1', amount)
  await tx.wait();

  console.log(`Transfer succesfully ${tx.hash}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
