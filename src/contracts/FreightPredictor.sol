
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract FreightPredictor {
    bool public done;
    bool public result;
    uint256 public end;
    
    uint256 public yes;
    uint256 public no;
    
    mapping(address => uint256) public wins;
    address public owner;
    
    event Bet(address user, bool side, uint256 amt);
    event End(bool res);
    
    constructor(uint256 _end) {
        owner = msg.sender;
        end = block.timestamp + _end;
    }
    
    function bet(bool side) public payable {
        require(!done && block.timestamp < end && msg.value > 0);
        
        if (side) {
            yes += msg.value;
        } else {
            no += msg.value;
        }
        
        emit Bet(msg.sender, side, msg.value);
    }
    
    function resolve(bool res) public {
        require(msg.sender == owner && !done && block.timestamp >= end);
        done = true;
        result = res;
        emit End(res);
    }
    
    function claim() public {
        require(done);
        uint256 pool = yes + no;
        uint256 win = result ? yes : no;
        uint256 amt = wins[msg.sender];
        require(amt > 0);
        wins[msg.sender] = 0;
        (bool ok,) = msg.sender.call{value: pool * amt / win}("");
        require(ok);
    }
    
    function stats() public view returns (uint256, uint256, uint256, uint256) {
        uint256 tot = yes + no;
        return (yes, no, tot > 0 ? yes * 100 / tot : 0, tot > 0 ? no * 100 / tot : 0);
    }
}
