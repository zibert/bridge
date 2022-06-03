import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("setOnwer")
    .setAction(async (args, hre) => {
        const network = hre.network.name;
        let erc20Adress;
        let bridgedress;
        if (network == "rinkeby") {
          erc20Adress = config.zcoinEthAddress
          bridgedress = config.bridgeEthAddress
        } else {
          erc20Adress = config.zcoinBscAddress
          bridgedress = config.bridgeBscAddress
        }
      
        const erc20 = (await hre.ethers.getContractAt("Zcoin", erc20Adress)) 
        await erc20.setOwner(bridgedress);
    });

task("mint")
    .addParam("to", "to address")
    .addParam("amount", "amount")
    .setAction(async (args, hre) => {
      const network = hre.network.name;
      let erc20Adress;
      if (network == "rinkeby") {
        erc20Adress = config.zcoinEthAddress
      } else {
        erc20Adress = config.zcoinBscAddress
      }
    
      const erc20 = (await hre.ethers.getContractAt("Zcoin", erc20Adress)) 
      await erc20.mint(args.to, hre.ethers.utils.parseEther(args.amount));
    });