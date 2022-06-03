import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("swap")
    .addParam("to", "to address")
    .addParam("amount", "amount")
    .setAction(async (args, hre) => {
      const network = hre.network.name;
      let bridgeAddress;
      if (network == "rinkeby") {
        bridgeAddress = config.bridgeEthAddress
      } else {
        bridgeAddress = config.bridgeBscAddress
      }
    
      const bridge = (await hre.ethers.getContractAt("Bridge", bridgeAddress)) 
      await bridge.swap(args.to, hre.ethers.utils.parseEther(args.amount));
    });