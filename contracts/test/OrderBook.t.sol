// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Orderbook} from "../src/Orderbook.sol";
import {LiquidityManager} from "../src/LiquidityManager.sol";
import {LiquidityManagerTest} from "./LiquidityManager.t.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {TestUtils} from "../script/utils/TestUtils.sol";

contract OrderbookTest is Test {
    Orderbook public orderbook;
    LiquidityManager public lpManager;
    MockERC20 inToken;
    MockERC20 outToken;
    TestUtils testUtils;

    address address1 = address(1);

    function setUp() public returns (Orderbook) {
        testUtils = new TestUtils();
        lpManager = new LiquidityManagerTest().setUp();
        orderbook = new Orderbook(address(lpManager), address(1));

        inToken = testUtils.returnErc20();
        outToken = testUtils.returnErc20();

        return orderbook;
    }

    function test_PlaceMarketOrder() public {
        vm.prank(address1);
        inToken.approve(address(orderbook), 0.1 ether);

        assertEq(inToken.balanceOf(address(lpManager)), 0);

        vm.prank(address1);
        orderbook.placeMarketOrder(
            address(inToken),
            address(outToken),
            0.1 ether
        );

        assertEq(inToken.balanceOf(address(lpManager)), 0.1 ether);

        assertEq(orderbook.getOrderById(1).orderId, 1);
        assertEq(orderbook.getOrderById(1).amountIn, 1 ether);
        assertEq(orderbook.getOrderById(1).inToken, address(inToken));
        assertEq(orderbook.getOrderById(1).outToken, address(outToken));
    }

    function test_MatchOrder() public {
        vm.prank(address1);
        orderbook.placeMarketOrder(
            address(inToken),
            address(outToken),
            0.1 ether
        );
    }
}
