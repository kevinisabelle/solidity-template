import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

pragma solidity >=0.8.4;

contract FlipContract is Ownable {
    using SafeMath for uint256;

    uint256 public contractBalance;

    event Bet(address indexed user, uint256 indexed bet, bool indexed win, uint8 side);
    event Funded(address owner, uint256 funding);

    // Function to simulate coin flip 50/50 randomnes
    function flip(uint8 side) public payable returns (bool) {
        require(address(this).balance >= msg.value.mul(2), "The contract hasn't enought funds");
        require(side == 0 || side == 1, "Incorrect side, needs to be 0 or 1");
        bool win;
        uint256 value = msg.value;
        if (block.timestamp % 2 != side) {
            contractBalance += value;
            win = false;
        } else {
            contractBalance -= value;
            payable(msg.sender).transfer(msg.value * 2);
            win = true;
        }
        emit Bet(msg.sender, value, win, side);
    }

    // Function to Withdraw Funds
    function withdrawAll() public onlyOwner returns (uint256) {
        payable(msg.sender).transfer(address(this).balance);
        assert(address(this).balance == 0);
        return address(this).balance;
    }

    // Function to get the Balance of the Contract
    function getBalance() public view returns (uint256) {
        return contractBalance;
    }

    // Fund the Contract
    function fundContract() public payable onlyOwner {
        require(msg.value != 0, "Bet must be different than zero");
        contractBalance = contractBalance.add(msg.value);
        emit Funded(msg.sender, msg.value);
        assert(contractBalance == address(this).balance);
    }
}
