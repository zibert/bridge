
import { ethers } from "hardhat";

async function main() {
  const Zcoin = await ethers.getContractFactory("Zcoin");
  const zcoin = await Zcoin.deploy();

  await zcoin.deployed();

  console.log("Zcoin deployed to:", zcoin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});