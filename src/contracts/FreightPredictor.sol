
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title FreightPredictor
 * @dev Smart contract for predicting freight prices between Shanghai and San Francisco
 */
contract FreightPredictor {
    // Market state
    bool public marketResolved = false;
    bool public marketResult;
    uint256 public marketCloseTime;
    
    // Prediction counts
    uint256 public yesPredictions;
    uint256 public noPredictions;
    
    // User predictions mapping
    mapping(address => uint256) public userYesPredictions;
    mapping(address => uint256) public userNoPredictions;
    
    // Total rewards pools
    uint256 public yesPool;
    uint256 public noPool;
    
    // Market creator and fee percentage
    address public creator;
    uint256 public feePercentage = 2; // 2% fee

    // Pending withdrawals
    mapping(address => uint256) public pendingWithdrawals;
    uint256 public creatorFees;
    
    // Events
    event PredictionMade(address user, bool prediction, uint256 amount);
    event RewardCalculated(address user, uint256 amount);
    event RewardClaimed(address user, uint256 amount);
    event MarketResolved(bool result);
    event FeesWithdrawn(address creator, uint256 amount);
    
    constructor(uint256 _marketDuration) {
        creator = msg.sender;
        marketCloseTime = block.timestamp + _marketDuration;
    }
    
    /**
     * @dev Make a prediction on the market
     * @param prediction true for Yes, false for No
     */
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
    
    /**
     * @dev Resolve the market with the final result
     * @param result true if freight prices exceeded 130%, false otherwise
     */
    function resolveMarket(bool result) public {
        require(msg.sender == creator, "Only creator can resolve the market");
        require(!marketResolved, "Market already resolved");
        require(block.timestamp >= marketCloseTime, "Market not yet closed");
        
        marketResolved = true;
        marketResult = result;
        
        // Calculate creator fees
        creatorFees = ((yesPool + noPool) * feePercentage) / 100;
        
        emit MarketResolved(result);
    }
    
    /**
     * @dev Calculate user's reward based on prediction accuracy
     */
    function calculateReward() public {
        require(marketResolved, "Market not yet resolved");
        uint256 reward = 0;
        
        if (marketResult) {
            // Yes was correct
            if (userYesPredictions[msg.sender] > 0) {
                uint256 userShare = (userYesPredictions[msg.sender] * 1e18) / yesPredictions;
                reward = (userShare * (yesPool + noPool) * (100 - feePercentage)) / (100 * 1e18);
                userYesPredictions[msg.sender] = 0;
            }
        } else {
            // No was correct
            if (userNoPredictions[msg.sender] > 0) {
                uint256 userShare = (userNoPredictions[msg.sender] * 1e18) / noPredictions;
                reward = (userShare * (yesPool + noPool) * (100 - feePercentage)) / (100 * 1e18);
                userNoPredictions[msg.sender] = 0;
            }
        }
        
        if (reward > 0) {
            pendingWithdrawals[msg.sender] += reward;
            emit RewardCalculated(msg.sender, reward);
        }
    }
    
    /**
     * @dev Withdraw available rewards
     */
    function withdrawReward() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No rewards to withdraw");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Get user predictions
     */
    function getUserPredictions(address user) public view returns (uint256 yesAmount, uint256 noAmount) {
        return (userYesPredictions[user], userNoPredictions[user]);
    }
    
    /**
     * @dev Get current market stats
     */
    function getMarketStats() public view returns (
        uint256, uint256, uint256, uint256
    ) {
        uint256 totalPredictions = yesPredictions + noPredictions;
        
        uint256 yesPercent = totalPredictions > 0 ? (yesPredictions * 100) / totalPredictions : 0;
        uint256 noPercent = totalPredictions > 0 ? (noPredictions * 100) / totalPredictions : 0;
        
        return (yesPredictions, noPredictions, yesPercent, noPercent);
    }
    
    /**
     * @dev Withdraw fees (only creator)
     */
    function withdrawFees() public {
        require(msg.sender == creator, "Only creator can withdraw fees");
        require(marketResolved, "Market not yet resolved");
        require(creatorFees > 0, "No fees to withdraw");
        
        uint256 amount = creatorFees;
        creatorFees = 0;
        
        (bool success, ) = creator.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FeesWithdrawn(creator, amount);
    }
    
    /**
     * @dev Get pending withdrawal amount for a user
     */
    function getPendingWithdrawal(address user) public view returns (uint256) {
        return pendingWithdrawals[user];
    }
}
