import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

const parseHexString = function(hex: string) { 
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

task("redeem")
    .addParam("to", "to address")
    .addParam("amount", "amount")
    .addParam("nonce", "nonce")
    .addParam("sign", "signature")
    .setAction(async (args, hre) => {
      const network = hre.network.name;
      let bridgeAddress;
      if (network == "rinkeby") {
        bridgeAddress = config.bridgeEthAddress
      } else {
        bridgeAddress = config.bridgeBscAddress
      }
      
      const bridge = (await hre.ethers.getContractAt("Bridge", bridgeAddress)) 
      await bridge.redeem(args.to, args.amount, args.nonce, args.sign);
    });