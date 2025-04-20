
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract FreightPredictor {
    struct Vote {
        uint256 yesCount;
        uint256 noCount;
    }

    Vote public currentVote;
    mapping(address => bool) public hasVoted;

    event VoteCast(address voter, bool voteType);

    function vote(bool voteYes) public {
        require(!hasVoted[msg.sender], "Already voted");
        
        hasVoted[msg.sender] = true;
        if (voteYes) {
            currentVote.yesCount += 1;
        } else {
            currentVote.noCount += 1;
        }
        
        emit VoteCast(msg.sender, voteYes);
    }

    function getVoteStats() public view returns (uint256, uint256, uint256, uint256) {
        uint256 total = currentVote.yesCount + currentVote.noCount;
        uint256 yesPercent = total > 0 ? (currentVote.yesCount * 100) / total : 0;
        uint256 noPercent = total > 0 ? (currentVote.noCount * 100) / total : 0;
        return (currentVote.yesCount, currentVote.noCount, yesPercent, noPercent);
    }
}
