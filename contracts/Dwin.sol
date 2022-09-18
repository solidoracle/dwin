// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title dwin
 * @notice An ERC1155 contract that generates a betting market for DAO voting
 */

contract Dwin is ERC1155, Ownable {
 
    uint256 public treasury;
    uint256 public numProposals = 1;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 proposalId, string _description);
    
    enum Vote {
        YAY, 
        NAY, 
        NONE 
    }

    struct Proposal {
        uint256 id;
        uint256 tokenYesId;
        uint256 tokenNoId;
        string description;
        uint256 deadline;
        uint256 yayVotes;
        uint256 nayVotes;
        uint256[2] totalNetBets;
        Vote outcome;
    }

    constructor() ERC1155("DWIN"){}

    function openMarket(string memory _description) public {
        Proposal storage proposal = proposals[numProposals];
        proposal.deadline = block.timestamp + 10 minutes;
        proposal.outcome = Vote.NONE;
        proposal.id = numProposals;
        proposal.description = _description;
        proposal.tokenYesId = proposal.id * 2;
        proposal.tokenNoId = proposal.id * 2 - 1;
        emit ProposalCreated(proposal.id, _description);
        numProposals++;
    }

    function makeBet(uint256 _proposalId, Vote bet) public payable {
        require(bet != Vote.NONE);
        
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.deadline - 5 minutes,"Betting period exceeded");
        uint256 tokenId = _proposalId * 2 - uint(bet);
        proposal.totalNetBets[uint(bet)] += msg.value;

        super._mint(msg.sender, tokenId, msg.value, "");
    }

    function voteOnProposal(uint256 _proposalId, Vote vote) external {
        require(vote != Vote.NONE);
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.deadline - 5 minutes && block.timestamp <= proposal.deadline,"Voting period exceeded");
        if (vote == Vote.YAY) {
            proposal.yayVotes += 1;
        } else {
            proposal.nayVotes += 1;
        }
    }

    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.deadline,"Voting still in process");
        if (proposal.yayVotes > proposal.nayVotes) {
            proposal.outcome = Vote.YAY; // vote passed is yes
        } else { 
            proposal.outcome = Vote.NAY; // vote passed is no
        }
    }


    /**
     * @notice Withdraw payout based on voting outcome, sharing among winners the loosing bets and taking the 5% fee
     */

    function withdraw(uint256 proposalId) public returns (uint256 payoutAfterFee) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.outcome != Vote.NONE,"Proposal not resolved");
        uint tokenId = proposalId * 2 - uint(proposal.outcome);
        uint256 balance = super.balanceOf(msg.sender, tokenId);
        super._burn(msg.sender, tokenId, balance);

        uint256 outcomeWinIndex = (tokenId) % 2;
        if (uint256(proposal.outcome) == outcomeWinIndex) {
            uint256 totalPayout = (
                (proposal.totalNetBets[0] + proposal.totalNetBets[1]) * balance
            ) / proposal.totalNetBets[outcomeWinIndex];

            uint256 fee = (totalPayout / 100) * 5;
            payoutAfterFee = totalPayout - fee;
            treasury += fee;
        }

        (bool sent,) = msg.sender.call{value: payoutAfterFee}("");
        require(sent, "Failed to withdraw");
        return payoutAfterFee;
    } 

    function withdrawTreasury() public onlyOwner {
        require(treasury >= 0);

        (bool sent, ) = msg.sender.call{value: treasury}("");
        require(sent, "Failed to withdraw");    

        treasury = 0;
    }

    function getTotalNetBets(uint proposalId) public view returns (uint[2] memory) {
        return proposals[proposalId].totalNetBets;
    }
}

