// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
// import "./MockERC20.sol";
import "../src/mocks/MockERC20.sol";

contract MintTokensScript is Script {
    function run() external {
        // Define the address as a uint256
        address recipient = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Replace with a valid address       
        uint256 amountToMint = 1000 * 10**18; // Amount of tokens to mint, adjusted for decimals

        // Start the broadcast
        vm.startBroadcast();


        // Mint tokens to the recipient address
        // MockERC20(0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6).mint(recipient, amountToMint);
       console.log(MockERC20(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266).symbol());

        // uint256 balance = MockERC20(0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6).balanceOf(recipient);
        // console.log("Balance of recipient:", balance/10**18);


        // Stop broadcasting
        vm.stopBroadcast();
    }        
}