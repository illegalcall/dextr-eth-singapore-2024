// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// --------- Errors ---------

contract Counter {
    // --------- State ---------
    uint256 public number;

    constructor() {}

    // --------- Events ---------

    // --------- Modifiers ---------

    // --------- Setter Functions ---------

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    // --------- Getter Functions ---------

    function increment() public {
        number++;
    }
}
