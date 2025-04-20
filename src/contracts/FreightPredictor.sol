
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
    
    // Events
    event PredictionMade(address user, bool prediction, uint256 amount);
    event RewardClaimed(address user, uint256 amount);
    event MarketResolved(bool result);
    
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
        
        emit MarketResolved(result);
    }
    
    /**
     * @dev Claim rewards after market is resolved
     */
    function claimReward() public {
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
        
        require(reward > 0, "No rewards to claim");
        
        payable(msg.sender).transfer(reward);
        emit RewardClaimed(msg.sender, reward);
    }
    
    /**
     * @dev Get user predictions
     * @return yesAmount user's yes predictions
     * @return noAmount user's no predictions
     */
    function getUserPredictions(address user) public view returns (uint256 yesAmount, uint256 noAmount) {
        return (userYesPredictions[user], userNoPredictions[user]);
    }
    
    /**
     * @dev Get current market stats
     * @return _yesPredictions total yes predictions
     * @return _noPredictions total no predictions
     * @return _yesPercentage percentage of yes predictions
     * @return _noPercentage percentage of no predictions
     */
    function getMarketStats() public view returns (
        uint256 _yesPredictions, 
        uint256 _noPredictions,
        uint256 _yesPercentage,
        uint256 _noPercentage
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
        
        uint256 fees = ((yesPool + noPool) * feePercentage) / 100;
        payable(creator).transfer(fees);
    }
}
