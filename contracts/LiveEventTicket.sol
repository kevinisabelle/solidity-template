pragma solidity >=0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LiveEventLib.sol";

contract LiveEventTicket is Ownable {
    using SafeMath for uint256;

    SeatCategory public seat;
    bool public hasAttended;
    address public whoHasAttended;
    bool public canBeResoldHigher;

    // mint ticket

    // sell ticket

    // set attended to true

    // transfert ownership
}
