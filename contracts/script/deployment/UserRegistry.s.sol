// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../../src/UserRegistry.sol";
import "../../src/mocks/MockERC20.sol"; // Import the MockERC20;

contract DeployUserRegistry is Script {
    function run() external {
        // Deploy the MockERC20 token
        MockERC20 mockToken = new MockERC20("Mock Token", "MTK");

        // Deploy the UserRegistry contract
        vm.startBroadcast();
        UserRegistry userRegistry = new UserRegistry(mockToken, address(this));
        vm.stopBroadcast();
    }
}
