pragma solidity >=0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LiveEventLib.sol";
import "hardhat/console.sol";
import "./LiveEventTicket.sol";

contract LiveEvent is Ownable {
    using SafeMath for uint256;

    uint256 public contractBalance;
    uint256 public numberOfSeats;
    string public name;
    string public location;
    bool public areTicketsEmmited;

    SeatCategory[] public seatCategories;
    LiveEventTicket[] public tickets;

    constructor(string memory _name, string memory seatConfig) {
        console.log("Creating new event with config:", seatConfig);
        name = _name;
        // seatCategories.push(new SeatCategory());
    }

    // transfert contract balance if attendance met criteria.

    // refund everyone.

    //
}
