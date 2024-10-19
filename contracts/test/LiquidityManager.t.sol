// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {LiquidityManager} from "../src/LiquidityManager.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {TestUtils} from "../script/utils/TestUtils.sol";

contract LiquidityManagerTest is Test {
    TestUtils testUtils;

    LiquidityManager public liquidityManager;

    address[] public tokenAddresses;
    uint256[] public pairIds;

    address address1 = address(1);

    function setUp() public returns (LiquidityManager) {
        testUtils = new TestUtils();

        address[] memory testTokens = new address[](5);
        for (uint256 i = 0; i < 4; i++) {
            testTokens[i] = address(testUtils.returnErc20());
            tokenAddresses.push(testTokens[i]);
            pairIds[i] = i;
        }

        liquidityManager = new LiquidityManager(testTokens, pairIds);

        return liquidityManager;
    }

    function test_Init() public view {
        assertEq(liquidityManager.isTokenSupported(tokenAddresses[0]), true);
    }

    function test_Tokendeposit() public {
        IERC20 token = IERC20(tokenAddresses[0]);
        uint256 amount = 1 ether;
        vm.prank(address1);
        token.approve(address(liquidityManager), amount);
    }

    function test_CreateLP() public {
        IERC20 primary = IERC20(tokenAddresses[0]);

        uint256 amount = 1 ether;
        vm.prank(address1);
        primary.approve(address(liquidityManager), amount);

        address[] memory tradingTokens = new address[](2);
        for (uint i = 0; i < 2; i++) {
            tradingTokens[i] = tokenAddresses[i];
        }

        uint256[] memory minPrices = new uint256[](2);
        for (uint i = 0; i < 2; i++) {
            minPrices[i] = 1;
        }

        uint256[] memory maxPrices = new uint256[](2);
        for (uint i = 0; i < 2; i++) {
            minPrices[i] = 2;
        }

        vm.prank(address1);
        liquidityManager.createLiquidityPosition(
            address(primary),
            1,
            2,
            1 ether,
            tradingTokens,
            minPrices,
            maxPrices
        );

        assertEq(liquidityManager.getLiquidityPosition(1).lpAddress, address1);
        assertEq(
            liquidityManager.getLiquidityPosition(1).primaryToken.minPrice,
            1
        );
        assertEq(
            liquidityManager.getLiquidityPosition(1).primaryToken.maxPrice,
            2
        );
        assertEq(
            liquidityManager.getLiquidityPosition(1).primaryToken.token,
            address(primary)
        );
    }

    function test_RemoveLP() public {
        IERC20 primary = IERC20(tokenAddresses[0]);

        assertEq(primary.balanceOf(address1), 1 ether);

        uint256 amount = 1 ether;
        vm.prank(address1);
        primary.approve(address(liquidityManager), amount);

        address[] memory tradingTokens = new address[](2);
        for (uint i = 0; i < 2; i++) {
            tradingTokens[i] = tokenAddresses[i];
        }

        uint256[] memory minPrices = new uint256[](2);
        for (uint i = 0; i < 2; i++) {
            minPrices[i] = 1;
        }

        uint256[] memory maxPrices = new uint256[](2);
        for (uint i = 0; i < 2; i++) {
            minPrices[i] = 2;
        }

        vm.prank(address1);
        liquidityManager.createLiquidityPosition(
            address(primary),
            1,
            2,
            1 ether,
            tradingTokens,
            minPrices,
            maxPrices
        );

        assertEq(primary.balanceOf(address1), 0);

        vm.prank(address1);
        liquidityManager.removeLiquidityPosition(1, tradingTokens, address1);

        assertEq(primary.balanceOf(address1), amount);
    }

    function updateLP() public {
        IERC20 primary = IERC20(tokenAddresses[0]);

        uint256 amount = 1 ether;
        vm.prank(address1);
        primary.approve(address(liquidityManager), amount);

        address[] memory tradingTokens = new address[](2);
        for (uint i = 0; i < 2; i++) {
            tradingTokens[i] = tokenAddresses[i];
        }

        uint256[] memory minPrices = new uint256[](2);
        for (uint i = 0; i < 2; i++) {
            minPrices[i] = 1;
        }

        uint256[] memory maxPrices = new uint256[](2);
        for (uint i = 0; i < 2; i++) {
            minPrices[i] = 2;
        }

        vm.prank(address1);
        liquidityManager.createLiquidityPosition(
            address(primary),
            1,
            2,
            1 ether,
            tradingTokens,
            minPrices,
            maxPrices
        );

        vm.prank(address1);
        liquidityManager.updateLiquidityPosition(
            1,
            0.5 ether,
            true,
            true,
            address(0)
        );

        assertEq(
            liquidityManager
                .getLiquidityPosition(1)
                .primaryToken
                .availableBalance,
            0.5 ether
        );

        liquidityManager.updateLiquidityPosition(
            1,
            0.5 ether,
            false,
            false,
            tradingTokens[0]
        );

        assertEq(
            liquidityManager
                .getTradingToken(1, tradingTokens[0])
                .availableBalance,
            0.5 ether
        );
    }
}
