import { ethers, waffle, network } from 'hardhat'
import chai from 'chai'

import web3 from 'web3';

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import ZcoinArtifacts from '../artifacts/contracts/Zcoin.sol/Zcoin.json'
import { Zcoin } from '../src/types/Zcoin'

import BridgeArtifacts from '../artifacts/contracts/Bridge.sol/Bridge.json'
import { Bridge } from '../src/types/Bridge'

const { deployContract } = waffle
const { expect } = chai

import { Contract, ContractReceipt } from "ethers"

const getEventData = (
  eventName: string,
  contract: Contract,
  txResult: ContractReceipt
): any => {
  if (!Array.isArray(txResult.logs)) return null;
  for (let log of txResult.logs) {
    try {
      const decoded = contract.interface.parseLog(log);
      if (decoded.name === eventName)
        return {
          ...decoded,
          ...decoded.args
        };
    } catch (error) { }
  }
  return null;
};

describe("Bridge", function () {
  let zcoin: Zcoin;
  let bridge: Bridge;
  let signers: SignerWithAddress[]
  let owner: SignerWithAddress;
  let acc1: SignerWithAddress;
  let acc2: SignerWithAddress;
  let validator: SignerWithAddress;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    owner = signers[0];
    acc1 = signers[1];
    acc2 = signers[2];
    validator = signers[3];

    zcoin = (await deployContract(owner, ZcoinArtifacts)) as Zcoin;

    bridge = (await deployContract(owner, BridgeArtifacts,
      [zcoin.address, validator.address]
    )) as Bridge;

    await zcoin.mint(acc1.address, ethers.utils.parseEther("100.0"))
    await zcoin.mint(acc2.address, ethers.utils.parseEther("100.0"))
    await zcoin.setOwner(bridge.address);
  })

  it("swap is correct", async function () {
    expect(await zcoin.balanceOf(acc1.address)).to.eq(ethers.utils.parseEther("100.0"));
    let receipt = await (await bridge.connect(acc1).swap(acc2.address, ethers.utils.parseEther("5.0"))).wait(1);
    expect(getEventData("swapInitialized", bridge, receipt).to).to.eq(acc2.address);
    expect(getEventData("swapInitialized", bridge, receipt).amount).to.eq(ethers.utils.parseEther("5.0"));
    expect(await zcoin.balanceOf(acc1.address)).to.eq(ethers.utils.parseEther("95.0"));
  });

  it("redeem is correct", async function () {
    expect(await zcoin.balanceOf(acc2.address)).to.eq(ethers.utils.parseEther("100.0"));

    let nonce = 42;
    let to = acc2.address;
    let amount = ethers.utils.parseEther("0.001").toNumber();

    let message = web3.utils.soliditySha3(to, amount, nonce) as string;
    let signature = await validator.signMessage(ethers.utils.arrayify(message));

    await bridge.redeem(to, amount, nonce, signature);

    expect(await zcoin.balanceOf(acc2.address)).to.eq(ethers.utils.parseEther("100.001"));
  });

  it("should be rejected when the address is changed", async function () {
    let nonce = 42;
    let to = acc2.address;
    let amount = ethers.utils.parseEther("0.001").toNumber();

    let message = web3.utils.soliditySha3(to, amount, nonce) as string;
    let signature = await validator.signMessage(ethers.utils.arrayify(message));

    await expect(bridge.redeem(acc1.address, amount, nonce, signature)).to.be.revertedWith(
      "bad signature"
    );
  });

  it("should be rejected when the number is reused", async function () {
    let nonce = 42;
    let to = acc2.address;
    let amount = ethers.utils.parseEther("0.001").toNumber();

    let message = web3.utils.soliditySha3(to, amount, nonce) as string;
    let signature = await validator.signMessage(ethers.utils.arrayify(message));

    await bridge.redeem(to, amount, nonce, signature);

    await expect(bridge.redeem(to, amount, nonce, signature)).to.be.revertedWith(
      "bad nonce"
    );
  });

  it("should be rejected when the validator is changed", async function () {
    let nonce = 42;
    let to = acc2.address;
    let amount = ethers.utils.parseEther("0.001").toNumber();

    let message = web3.utils.soliditySha3(to, amount, nonce) as string;
    let signature = await acc1.signMessage(ethers.utils.arrayify(message));

    await expect(bridge.redeem(acc1.address, amount, nonce, signature)).to.be.revertedWith(
      "bad signature"
    );
  });
});
