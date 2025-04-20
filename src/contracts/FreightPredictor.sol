
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract FreightPredictor {
    bool public done;
    bool public result;
    uint256 public end;
    
    uint256 public yes;
    uint256 public no;
    
    mapping(address => uint256) public bets;
    mapping(address => bool) public sides;
    address public owner;
    
    event Bet(address user, bool side, uint256 amt);
    event End(bool res);
    
    constructor(uint256 _end) {
        owner = msg.sender;
        end = block.timestamp + _end;
    }
    
    function bet(bool side) public payable {
        require(!done && block.timestamp < end && msg.value > 0, "Invalid bet");
        
        bets[msg.sender] += msg.value;
        sides[msg.sender] = side;
        
        if (side) {
            yes += msg.value;
        } else {
            no += msg.value;
        }
        
        emit Bet(msg.sender, side, msg.value);
    }
    
    function resolve(bool res) public {
        require(msg.sender == owner && !done && block.timestamp >= end, "Not allowed");
        done = true;
        result = res;
        emit End(res);
    }
    
    function claim() public {
        require(done, "Not ended");
        require(bets[msg.sender] > 0, "No bets");
        
        bool userSide = sides[msg.sender];
        require(userSide == result, "Wrong side");
        
        uint256 amount = bets[msg.sender];
        uint256 pool = yes + no;
        uint256 winPool = result ? yes : no;
        
        bets[msg.sender] = 0;
        
        uint256 payout = pool * amount / winPool;
        (bool sent,) = msg.sender.call{value: payout}("");
        require(sent, "Failed");
    }
    
    function stats() public view returns (uint256, uint256, uint256, uint256) {
        uint256 tot = yes + no;
        uint256 yesP = tot > 0 ? yes * 100 / tot : 0;
        uint256 noP = tot > 0 ? no * 100 / tot : 0;
        return (yes, no, yesP, noP);
    }
}
