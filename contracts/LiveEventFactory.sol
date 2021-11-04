// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./LiveEventTicket.sol";

contract LiveEventFactory {
    mapping(address => LiveEventTicket[]) public liveEvents;

    constructor() {}

    function createLiveEvent(
        string memory name,
        string memory location,
        uint256[] memory prices,
        string[] memory categories,
        uint256[] memory seatCounts,
        bool[] memory canBeResoldHigher
    ) public {
        LiveEventTicket newEvent = new LiveEventTicket(
            name,
            location,
            prices,
            categories,
            seatCounts,
            canBeResoldHigher
        );

        newEvent.transferOwnership(msg.sender);
        liveEvents[msg.sender].push(newEvent);
    }

    function getEvent(address owner, uint256 index) public view returns (LiveEventTicket) {
        return LiveEventTicket(address(liveEvents[owner][index]));
    }
}
