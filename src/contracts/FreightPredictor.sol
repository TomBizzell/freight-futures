
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
    
    uint256 public yesPool;
    uint256 public noPool;
    
    address public creator;
    uint256 public feePercentage = 2;

    mapping(address => uint256) public pendingWithdrawals;
    uint256 public creatorFees;
    
    event PredictionMade(address user, bool prediction, uint256 amount);
    event MarketResolved(bool result);
    
    constructor(uint256 _marketDuration) {
        creator = msg.sender;
        marketCloseTime = block.timestamp + _marketDuration;
    }
    
    function makePrediction(bool prediction) public payable {
        require(!marketResolved, "Market already resolved");
        require(block.timestamp < marketCloseTime, "Market closed for predictions");
        require(msg.value > 0, "Prediction amount must be greater than 0");
        
        if (prediction) {
            userYesPredictions[msg.sender] += msg.value;
            yesPredictions += msg.value;
            yesPool += msg.value;
        } else {
            userNoPredictions[msg.sender] += msg.value;
            noPredictions += msg.value;
            noPool += msg.value;
        }
        
        emit PredictionMade(msg.sender, prediction, msg.value);
    }
    
    function resolveMarket(bool result) public {
        require(msg.sender == creator, "Only creator can resolve the market");
        require(!marketResolved, "Market already resolved");
        require(block.timestamp >= marketCloseTime, "Market not yet closed");
        
        marketResolved = true;
        marketResult = result;
        
        creatorFees = ((yesPool + noPool) * feePercentage) / 100;
        
        emit MarketResolved(result);
    }
    
    function calculateReward() public {
        require(marketResolved, "Market not yet resolved");
        uint256 reward = 0;
        
        if (marketResult) {
            if (userYesPredictions[msg.sender] > 0) {
                uint256 userShare = (userYesPredictions[msg.sender] * 1e18) / yesPredictions;
                reward = (userShare * (yesPool + noPool) * (100 - feePercentage)) / (100 * 1e18);
                userYesPredictions[msg.sender] = 0;
            }
        } else {
            if (userNoPredictions[msg.sender] > 0) {
                uint256 userShare = (userNoPredictions[msg.sender] * 1e18) / noPredictions;
                reward = (userShare * (yesPool + noPool) * (100 - feePercentage)) / (100 * 1e18);
                userNoPredictions[msg.sender] = 0;
            }
        }
        
        if (reward > 0) {
            pendingWithdrawals[msg.sender] += reward;
        }
    }
    
    function withdrawReward() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No rewards to withdraw");
        
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
    
    function withdrawFees() public {
        require(msg.sender == creator, "Only creator can withdraw fees");
        require(marketResolved, "Market not yet resolved");
        require(creatorFees > 0, "No fees to withdraw");
        
        uint256 amount = creatorFees;
        creatorFees = 0;
        
        (bool success, ) = creator.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
