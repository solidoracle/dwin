// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

///TODO: timeframe modifiers

contract Dwin is ERC1155, Ownable {
 
    // Create a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    // Number of proposals that have been created
    uint256 public numProposals = 1;
    uint256 public treasury;

    enum Vote {
        YAY, // 0
        NAY, // 1
        NONE // 2
    }

    struct Proposal {
        uint256 id;
        string description;
        uint256 deadline;
        uint256 yayVotes;
        uint256 nayVotes;
        uint256[2] totalNetBets;
        Vote outcome;
    }

    constructor() ERC1155("DWIN"){}

    function createProposal(string memory _description) public returns (uint256) {
        Proposal storage proposal = proposals[numProposals];
        proposal.deadline = block.timestamp + 5 minutes;
        proposal.outcome = Vote.NONE;
        proposal.id = numProposals;
        proposal.description = _description;
        numProposals++;
        return numProposals - 1;
    }

    function makeBet(uint256 _proposalId, Vote bet) public payable {
        require(bet != Vote.NONE);
        Proposal storage proposal = proposals[_proposalId];
        
        uint256 tokenId = _proposalId * 2 - (uint(bet) == 0 ? 1 : 0); 
        proposal.totalNetBets[(tokenId + 1) % 2] += msg.value;

        super._mint(msg.sender, tokenId, msg.value, "");
    }

    function voteOnProposal(uint256 _proposalId, Vote vote) external {
        require(vote != Vote.NONE);
        Proposal storage proposal = proposals[_proposalId];

        if (vote == Vote.YAY) {
            proposal.yayVotes += 1;
        } else {
            proposal.nayVotes += 1;
        }
    }

    function executeProposal(uint256 _proposalId) external onlyOwner {
    Proposal storage proposal = proposals[_proposalId];
    Vote outcomeWon;
    if (proposal.yayVotes > proposal.nayVotes) {
        outcomeWon = Vote.YAY; // vote passed is yes
        } else { 
            outcomeWon = Vote.NAY; // vote passed is no
        }
    proposal.outcome = outcomeWon;
    }


    /**
     * @notice Withdraw payout based on voting outcome, sharing among winners the loosing bets
     * @param  tokenId array of bet tokens ids withdraw payout to
     */
    function withdraw(uint256 tokenId) public
        returns (uint256 payoutAfterFee) {
            uint256 balance = super.balanceOf(msg.sender, tokenId);

            uint256 proposalId = (tokenId + 1) / 2; // l'invesrso di quello visto a riga 278
            
            Proposal storage proposal = proposals[proposalId];

            super._burn(msg.sender, tokenId, balance);

            uint256 outcomeWinIndex = (tokenId + 1) % 2;

            if (uint256(proposal.outcome) == outcomeWinIndex) {
                    uint256 totalPayout =
                        ((proposal.totalNetBets[0] +
                            proposal.totalNetBets[1]) * balance) /
                        proposal.totalNetBets[outcomeWinIndex];

                    uint256 fee = totalPayout / 100;
                    payoutAfterFee = totalPayout - fee;
                    treasury += fee;
                }
                payable(msg.sender).call{value: payoutAfterFee}("");
                return payoutAfterFee;
            } 

        function withdrawTreasury() public onlyOwner {
            require(treasury >= 0);
            payable(msg.sender).call{value: treasury}("");
            treasury = 0;
        }
}
    



