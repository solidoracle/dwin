import { describe } from 'mocha';
import { expect, assert } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import { Dwin } from "../typechain-types";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { helpers } from "@nomiclabs/hardhat-ethers";

describe("dwin", function () {
    let contract: Dwin;
    let deployer: SignerWithAddress;
    let player2: SignerWithAddress;
    let player3: SignerWithAddress;

    async function dropBalance() {
      let receiverAddress = '0x0000000000000000000000000000000000000000'
      let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther("1000000")
      }
      
      deployer.sendTransaction(tx)
      .then((txObj) => {
          console.log('txHash', txObj.hash)
          // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
          // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
      })
      console.log("TRANSACTION COMPLETED")
    }

    beforeEach(async () => {
      const Dwin = await ethers.getContractFactory("Dwin");
      [deployer, player2, player3] = await ethers.getSigners()
      contract = await Dwin.connect(deployer).deploy();
      dropBalance();
    });
  
    async function openMarket() {
      const description = "Test Description";
      const marketOpen = await contract.openMarket(description)
      const receipt = await marketOpen.wait()
      const provider = ethers.provider

      const proposal = await contract.proposals(1)
      const block = await provider.getBlock(receipt.blockNumber)  

      expect(proposal.description).to.equal(description)
      expect(proposal.id).to.equal(1)
      expect(proposal.deadline).to.equal(block.timestamp + 600)
      expect(proposal.outcome).to.equal(2)
      expect(proposal.tokenYesId).to.equal(2)
      expect(proposal.tokenNoId).to.equal(1)
    }

    async function placeBets() {
      let proposal = await contract.proposals(1)
      assert(proposal.id.eq(1), "ID should not be zero");
      const Yes = 0
      const No = 1
      const data = { value: ethers.utils.parseEther("10") }
      const bet1 = await contract.connect(deployer).makeBet(proposal.id, Yes, data)
      const bet2 = await contract.connect(player2).makeBet(proposal.id, Yes, data)
      const bet3 = await contract.connect(player3).makeBet(proposal.id, No, data)

      let player1Bal = await contract.balanceOf(deployer.address, proposal.tokenYesId);
      let player2Bal = await contract.balanceOf(player2.address, proposal.tokenYesId);
      let player3Bal = await contract.balanceOf(player3.address, proposal.tokenNoId);
      
      expect(player1Bal).to.equal(ethers.utils.parseEther("10"))
      expect(player2Bal).to.equal(ethers.utils.parseEther("10"))
      expect(player3Bal).to.equal(ethers.utils.parseEther("10"))
    }

    async function placeVotes() {
      let proposal = await contract.proposals(1)
      const Yes = 0
      const No = 1

      const vote1 = await contract.connect(deployer).voteOnProposal(proposal.id, Yes)
      const vote2 = await contract.connect(player2).voteOnProposal(proposal.id, Yes)
      const vote3 = await contract.connect(player3).voteOnProposal(proposal.id, No)

      proposal = await contract.proposals(1);
      expect(proposal.yayVotes).to.equal(2)
      expect(proposal.nayVotes).to.equal(1)
    }

    async function execute() {
      let proposal = await contract.proposals(1)
      const execute = await contract.connect(deployer).executeProposal(proposal.id)
      proposal = await contract.proposals(1)
      expect(proposal.outcome).to.equal(0)
    }


    async function withdraw() {
      let proposal = await contract.proposals(1)


      const deployerBalanceBefore: any = await deployer.getBalance()
      console.log("bal before", deployerBalanceBefore)
      const player2BalanceBefore: any = await player2.getBalance()
      const player3BalanceBefore: any = await player3.getBalance()

      const withdraw1 = await contract.connect(deployer).withdraw(proposal.id)
      const receipt = await withdraw1.wait()
      const gasUsed: any = receipt.gasUsed.mul(receipt.effectiveGasPrice)
      console.log("gas used:", gasUsed)
      const withdraw2 = await contract.connect(player2).withdraw(proposal.id)
      const withdraw3 = await contract.connect(player3).withdraw(proposal.id)

      const deployerBalanceAfter: any = await deployer.getBalance()
      console.log("bal after", deployerBalanceAfter)
      
      const player2BalanceAfter: any = await player2.getBalance()
      const player3BalanceAfter: any = await player3.getBalance()

      console.log("balance before", deployerBalanceBefore)
      console.log("balance after", deployerBalanceAfter)
      console.log("difference", (deployerBalanceAfter - deployerBalanceBefore) - parseInt(gasUsed))
      console.log("difference2", deployerBalanceBefore - deployerBalanceAfter)
      console.log("difference3", (deployerBalanceAfter + gasUsed) - deployerBalanceBefore)
      //expect(deployerBalanceAfter - deployerBalanceBefore).to.equal(1425)
      //expect(player2Bal).to.equal(1000)
      //expect(player3Bal).to.equal(1000)
    }


    describe("Basic Scenario", () => {
      it("should open betting market", async function () {
        await openMarket();
      });

      it("should place bets", async function () {
        await openMarket();
        await placeBets();

      });

      it("should vote", async function () {
        await openMarket();
        await placeBets();
        await placeVotes();
      });

      it("should execute proposal", async function () {
        await openMarket();
        await placeBets();
        await placeVotes();
        await execute();


        
      });

      it("should withdraw", async function () {
        await openMarket();
        await placeBets();
        await placeVotes();
        await execute();
        await withdraw();



      });


      
    });

    it("should return proposal zero through automatic getter", async function() {
      let proposal = await contract.proposals(0);
      assert(proposal.id.eq(0), "proposalId");
      assert(proposal.deadline.eq(0), "deadline");
      assert(proposal.yayVotes.eq(0), "yayVotes");
      assert(proposal.nayVotes.eq(0), "nayVotes");

      let totalNetBets = await contract.getTotalNetBets(0);
      assert(totalNetBets[0].eq(0));
      assert(totalNetBets[1].eq(0));
    });
  });