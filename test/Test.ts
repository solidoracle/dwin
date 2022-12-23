import { describe } from 'mocha';
import { expect, assert } from 'chai';
import { Dwin } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { setBalance } from '@nomicfoundation/hardhat-network-helpers';

describe('dwin', function () {
  let contract: Dwin;
  let deployer: SignerWithAddress;
  let player2: SignerWithAddress;
  let player3: SignerWithAddress;

  beforeEach(async () => {
    const Dwin = await ethers.getContractFactory('Dwin');
    [deployer, player2, player3] = await ethers.getSigners();
    contract = await Dwin.connect(deployer).deploy();
    setBalance(deployer.address, ethers.utils.parseEther('100'));
  });

  async function openMarket() {
    const description = 'Test Description';
    const marketOpen = await contract.openMarket(description);
    const receipt = await marketOpen.wait();
    const provider = ethers.provider;

    const proposal = await contract.proposals(1);
    const block = await provider.getBlock(receipt.blockNumber);

    expect(proposal.description).to.equal(description);
    expect(proposal.id).to.equal(1);
    expect(proposal.deadline).to.equal(block.timestamp + 600);
    expect(proposal.outcome).to.equal(2);
    expect(proposal.tokenYesId).to.equal(2);
    expect(proposal.tokenNoId).to.equal(1);
  }

  async function placeBets() {
    let proposal = await contract.proposals(1);
    assert(proposal.id.eq(1), 'ID should not be zero');
    const Yes = 0;
    const No = 1;
    const data = { value: ethers.utils.parseEther('10') };
    const bet1 = await contract.connect(deployer).makeBet(proposal.id, Yes, data);
    const bet2 = await contract.connect(player2).makeBet(proposal.id, Yes, data);
    const bet3 = await contract.connect(player3).makeBet(proposal.id, No, data);

    let player1Bal = await contract.balanceOf(deployer.address, proposal.tokenYesId);
    let player2Bal = await contract.balanceOf(player2.address, proposal.tokenYesId);
    let player3Bal = await contract.balanceOf(player3.address, proposal.tokenNoId);

    let totalBetsYes = await contract.totalBets(1, 0);
    let totalBetsNo = await contract.totalBets(1, 1);

    expect(totalBetsYes).to.equal(ethers.utils.parseEther('20'));
    expect(totalBetsNo).to.equal(ethers.utils.parseEther('10'));

    expect(player1Bal).to.equal(ethers.utils.parseEther('10'));
    expect(player2Bal).to.equal(ethers.utils.parseEther('10'));
    expect(player3Bal).to.equal(ethers.utils.parseEther('10'));
  }

  async function placeVotes() {
    let proposal = await contract.proposals(1);
    const Yes = 0;
    const No = 1;
    const blockNumber = await ethers.provider.getBlockNumber();
    const fiveMinutesPast = (await ethers.provider.getBlock(blockNumber)).timestamp + 301;
    await ethers.provider.send('evm_mine', [fiveMinutesPast]);

    const vote1 = await contract.connect(deployer).voteOnProposal(proposal.id, Yes);
    const vote2 = await contract.connect(player2).voteOnProposal(proposal.id, Yes);
    const vote3 = await contract.connect(player3).voteOnProposal(proposal.id, No);

    proposal = await contract.proposals(1);
    expect(proposal.yayVotes).to.equal(2);
    expect(proposal.nayVotes).to.equal(1);
  }

  async function execute() {
    let proposal = await contract.proposals(1);
    const blockNumber = await ethers.provider.getBlockNumber();
    const tenMinutesPast = (await ethers.provider.getBlock(blockNumber)).timestamp + 601;
    await ethers.provider.send('evm_mine', [tenMinutesPast]);
    const execute = await contract.connect(deployer).executeProposal(proposal.id);
    proposal = await contract.proposals(1);
    expect(proposal.outcome).to.equal(0);
  }

  async function withdraw() {
    let proposal = await contract.proposals(1);
    await expect(contract.connect(deployer).withdraw(proposal.id)).to.changeEtherBalance(
      deployer,
      ethers.utils.parseEther('14.25')
    );
    await expect(contract.connect(player2).withdraw(proposal.id)).to.changeEtherBalance(
      player2,
      ethers.utils.parseEther('14.25')
    );
    await expect(contract.connect(player3).withdraw(proposal.id)).to.changeEtherBalance(
      player2,
      ethers.utils.parseEther('0')
    );
  }

  async function withdrawTreasury() {
    expect(contract.connect(deployer).withdrawTreasury()).to.changeEtherBalance(
      deployer,
      ethers.utils.parseEther('1.5')
    );
  }

  describe('Basic Scenario', () => {
    it('should open betting market', async function () {
      await openMarket();
    });

    it('should place bets', async function () {
      await openMarket();
      await placeBets();
    });

    it('should vote', async function () {
      await openMarket();
      await placeBets();
      await placeVotes();
    });

    it('should execute proposal', async function () {
      await openMarket();
      await placeBets();
      await placeVotes();
      await execute();
    });

    it('should withdraw', async function () {
      await openMarket();
      await placeBets();
      await placeVotes();
      await execute();
      await withdraw();
      await withdrawTreasury();
    });
  });

  it('should return proposal zero through automatic getter', async function () {
    let proposal = await contract.proposals(0);
    let totalBetsYes = await contract.totalBets(0, 0);
    let totalBetsNo = await contract.totalBets(0, 1);
    assert(proposal.id.eq(0), 'proposalId');
    assert(proposal.deadline.eq(0), 'deadline');
    assert(totalBetsYes.eq(0));
    assert(totalBetsNo.eq(0));
  });
});
