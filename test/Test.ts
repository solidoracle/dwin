import { describe } from 'mocha';
import { expect } from 'chai';
import { ethers } from 'hardhat'
import { Dwin } from "../typechain-types";

describe("Greeter", function () {
    let contract: Dwin;
  
    beforeEach(async () => {
      const Dwin = await ethers.getContractFactory("Dwin");
      const [deployer] = await ethers.getSigners()
      contract = await Dwin.connect(deployer).deploy();
    });
  
    describe("deploy", () => {
      it("should set owner", async function () {
        const [deployer] = await ethers.getSigners()
        expect(await contract.owner()).to.equal(deployer.address)
  
      });
    });
  });