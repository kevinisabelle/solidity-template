// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract LiveEventTicket is ERC1155PresetMinterPauser, Ownable {
    uint256 public _contractBalance;
    string public _name;
    string public _location;

    uint256[] public _prices;
    string[] public _categories;
    uint256[] public _seatCounts;
    bool[] public _canBeResoldHigher;
    uint256[] public _supplies;

    struct TicketForSale {
        address seller;
        uint256 category;
        uint256 salePrice;
        uint256 amount;
    }

    mapping(address => uint256) public tickerOwners;
    TicketForSale[] public toSell;
    mapping(address => uint256) public attendees;

    constructor(
        string memory name,
        string memory location,
        uint256[] memory prices,
        string[] memory categories,
        uint256[] memory seatCounts,
        bool[] memory canBeResoldHigher
    ) ERC1155PresetMinterPauser("https://blockchain.tickets.com/api/item/{id}.json") {
        _name = name;
        _location = location;
        _canBeResoldHigher = canBeResoldHigher;
        _seatCounts = seatCounts;
        _categories = categories;
        _prices = prices;
        _supplies = new uint256[](prices.length);
    }

    // mint tickets
    function mintTickets() public onlyOwner {
        uint256 totalQtyToMint = 0;
        // Check the category was not minted before.
        for (uint256 categoryIndex = 0; categoryIndex < _prices.length; categoryIndex++) {
            uint256 qtyToMint = _seatCounts[categoryIndex] - _supplies[categoryIndex];
            totalQtyToMint += qtyToMint;
        }

        require(totalQtyToMint > 0, "No more tickets to mint");

        for (uint256 categoryIndex = 0; categoryIndex < _prices.length; categoryIndex++) {
            uint256 qtyToMint = _seatCounts[categoryIndex] - _supplies[categoryIndex];

            if (qtyToMint > 0) {
                _mint(msg.sender, categoryIndex, qtyToMint, stringToBytes(_categories[categoryIndex]));
                _supplies[categoryIndex] += qtyToMint;
            }
        }
    }

    function setTicketsForSale(
        uint256 categoryIndex,
        uint256 amount,
        uint256 price
    ) public {
        uint256 userBalance = balanceOf(msg.sender, categoryIndex);
        require(userBalance > 0, "User has no ticket of this category");

        int256 ticketsIndex = this.getTicketsForSaleIndex(msg.sender, categoryIndex);

        if (ticketsIndex > -1) {
            TicketForSale memory tickets = toSell[uint256(ticketsIndex)];
            if (tickets.amount != 0) {
                uint256 qtyAlreadyForSale = tickets.amount;
                uint256 availableToSell = userBalance - qtyAlreadyForSale;
                require(availableToSell >= amount, "No more tickets to sell from this address");
            }
        }

        // Validate sold price
        if (!_canBeResoldHigher[categoryIndex]) {
            require(price <= _prices[categoryIndex], "Cannot resell higher than the original price");
        }

        if (ticketsIndex == -1) {
            TicketForSale memory tickets;
            tickets.amount = amount;
            tickets.salePrice = price;
            tickets.seller = msg.sender;
            toSell.push(tickets);
        } else {
            toSell[uint256(ticketsIndex)].amount += amount;
            toSell[uint256(ticketsIndex)].salePrice = price;
        }
    }

    // buy ticket
    function buyTicket(
        address from,
        address to,
        uint256 amount,
        uint256 categoryIndex
    ) public payable {
        // Check that the from has the required amount of tickets
        require(balanceOf(from, categoryIndex) > 0, "No more tickets to sell from this address");

        // Check that the ticket is for sell and get the price

        // Transfert tickets to destination

        // Transfert value to ticket owner
        // if (to == )

        _safeTransferFrom(from, to, categoryIndex, amount, stringToBytes("Buy ticket"));
    }

    // function getTicketPrice(address from, uint256 categoryIndex) private returns (TicketPrice ticketPrice) {}

    function getTotalTicketCount() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _seatCounts.length; i++) {
            total += _seatCounts[i];
        }

        return total;
    }

    function getTotalTicketsMinted() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _supplies.length; i++) {
            total += _supplies[i];
        }

        return total;
    }

    function getTicketsForSale() public view returns (TicketForSale[] memory) {
        return toSell;
    }

    function getTicketsForSaleIndex(address seller, uint256 categoryIndex) public view returns (int256) {
        int256 result = -1;

        for (uint256 i = 0; i < toSell.length; i++) {
            TicketForSale memory tickets = toSell[i];

            if (tickets.category == categoryIndex && tickets.seller == seller) {
                result = int256(i);
                break;
            }
        }

        return result;
    }

    // set attended to true
    // function attendEvent() public {
    // msg.sender
    // }

    // transfert ownership
    function transfertTicket(
        address from,
        address to,
        uint256 category,
        uint256 amount
    ) public {
        _safeTransferFrom(from, to, category, amount, stringToBytes("Transfert ticket"));
    }

    function stringToBytes(string memory s) public pure returns (bytes memory) {
        bytes memory b3 = bytes(s);
        return b3;
    }
}
