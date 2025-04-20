
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract FreightPredictor {
    bool public marketResolved;
    bool public marketResult;
    uint256 public marketCloseTime;
    
    uint256 public yesPredictions;
    uint256 public noPredictions;
    
    mapping(address => uint256) public userYesPredictions;
    mapping(address => uint256) public userNoPredictions;
    
    address public creator;
    uint256 public feePercentage = 2;

    mapping(address => uint256) public pendingWithdrawals;
    
    event PredictionMade(address user, bool prediction, uint256 amount);
    event MarketResolved(bool result);
    
    constructor(uint256 _marketDuration) {
        creator = msg.sender;
        marketCloseTime = block.timestamp + _marketDuration;
    }
    
    function makePrediction(bool prediction) public payable {
        require(!marketResolved, "Market already resolved");
        require(block.timestamp < marketCloseTime, "Market closed");
        require(msg.value > 0, "Amount must be > 0");
        
        if (prediction) {
            userYesPredictions[msg.sender] += msg.value;
            yesPredictions += msg.value;
        } else {
            userNoPredictions[msg.sender] += msg.value;
            noPredictions += msg.value;
        }
        
        emit PredictionMade(msg.sender, prediction, msg.value);
    }
    
    function resolveMarket(bool result) public {
        require(msg.sender == creator, "Only creator can resolve");
        require(!marketResolved, "Already resolved");
        require(block.timestamp >= marketCloseTime, "Not yet closed");
        
        marketResolved = true;
        marketResult = result;
        
        emit MarketResolved(result);
    }
    
    function calculateReward() public {
        require(marketResolved, "Not resolved");
        uint256 reward = 0;
        uint256 totalPool = yesPredictions + noPredictions;
        uint256 winningPool = marketResult ? yesPredictions : noPredictions;
        
        if (marketResult && userYesPredictions[msg.sender] > 0) {
            reward = totalPool * userYesPredictions[msg.sender] / winningPool;
            userYesPredictions[msg.sender] = 0;
        } else if (!marketResult && userNoPredictions[msg.sender] > 0) {
            reward = totalPool * userNoPredictions[msg.sender] / winningPool;
            userNoPredictions[msg.sender] = 0;
        }
        
        if (reward > 0) {
            uint256 fee = (reward * feePercentage) / 100;
            pendingWithdrawals[msg.sender] += (reward - fee);
            pendingWithdrawals[creator] += fee;
        }
    }
    
    function withdrawReward() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function getMarketStats() public view returns (uint256, uint256, uint256, uint256) {
        uint256 totalPredictions = yesPredictions + noPredictions;
        uint256 yesPercent = totalPredictions > 0 ? (yesPredictions * 100) / totalPredictions : 0;
        uint256 noPercent = totalPredictions > 0 ? (noPredictions * 100) / totalPredictions : 0;
        return (yesPredictions, noPredictions, yesPercent, noPercent);
    }
}
