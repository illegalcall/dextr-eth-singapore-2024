// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


error UserAlreadyRegistered();
error TokenTransferedFail();
contract UserRegistry {
    IERC20 public stakedToken;
    address public stakingContract;

    mapping(address => bool) public userRegistry;

    event UserRegistered(address indexed user);

    constructor(IERC20 _stakedToken, address _stakingContract) {
        stakedToken = _stakedToken;
        stakingContract = _stakingContract;
    }

    function isUserRegistered(address user) external view returns (bool) {
        return userRegistry[user];
    }

    // function registerUser() external {
    //     // require(userRegistry[msg.sender], "User is already registered");
    //     // if(userRegistry[msg.sender]) {
    //     //     revert UserAlreadyRegistered();
    //     // }

    //     uint256 amountToStake = 10 * 10**18; // Example amount to stake
    //     // Perform the token transfer and handle the error accordingly
    //     bool success = stakedToken.transferFrom(msg.sender, stakingContract, amountToStake);
    //     // require(success, "Token transfer failed");
    //     // if(!success){
    //     //     revert TokenTransferedFail();
    //     // }

    //     // Update the user registry mapping
    //     userRegistry[msg.sender] = true;

    //     // Emit event
    //     emit UserRegistered(msg.sender);
    // }
}
