import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import web3 from 'web3';

task("sign")
    .addParam("to", "to address")
    .addParam("amount", "amount")
    .addParam("nonce", "nonce")
    .setAction(async (args, hre) => {
        let message = web3.utils.soliditySha3(args.to, args.amount, args.nonce) as string;
        let validator = (await hre.ethers.getSigners())[0];
        let signature = await validator.signMessage(hre.ethers.utils.arrayify(message));
        console.log("signature: " + signature)
    });