// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";
import "../src/mocks/MockERC20.sol";
import "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

contract UserRegistryTest is Test {
    UserRegistry userRegistry;
    MockERC20 mockToken;

    address user = address(0x1);
    address stakingContract = address(0x2);

    function setUp() public {
        mockToken = new MockERC20("Mock Token", "MTK");
        userRegistry = new UserRegistry(mockToken, stakingContract);
        mockToken.mint(address(this), 1000 * 10 ** 18); // Mint 1000 tokens to the test account
    }

    function testRegisterUser() public {
        // Approve the UserRegistry to spend tokens
        mockToken.approve(address(userRegistry), 100 * 10 ** 18);

        // Simulate user calling registerUser
        vm.startPrank(address(this));
        userRegistry.registerUser();
        vm.stopPrank();

        // Check if the user is registered
        assertTrue(
            userRegistry.checkUserRegistered(address(this)),
            "User should be registered"
        );
    }

    function testCannotRegisterTwice() public {
        // Approve the UserRegistry to spend tokens
        mockToken.approve(address(userRegistry), 100 * 10 ** 18);

        // Simulate user calling registerUser
        vm.startPrank(address(this));
        userRegistry.registerUser();
        vm.stopPrank();

        // Try to register again
        vm.startPrank(address(this));
        vm.expectRevert("User is already registered");
        userRegistry.registerUser();
        vm.stopPrank();
    }    
}
