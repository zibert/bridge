
import { ethers } from "hardhat";
import hre from 'hardhat'

import config from '../config.json'

async function main() {
  const network = hre.network.name;
  let erc20Adress;
  if (network == "rinkeby") {
    erc20Adress = config.zcoinEthAddress
  } else {
    erc20Adress = config.zcoinBscAddress
  }

  let validatorAddress = (await ethers.getSigners())[0].address;

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(erc20Adress, validatorAddress);
  await bridge.deployed();

  console.log("Bridge deployed to:", bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
