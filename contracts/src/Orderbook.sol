// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Order} from "./utils/Types.sol";
import {console} from "forge-std/console.sol";
import {LiquidityManager} from "./LiquidityManager.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockOracleClient} from "./mocks/MockOracleClient.sol";
import {Order, LiquidityGroup, LiquidityToken} from "./utils/Types.sol";

// --------- Errors ---------

error Orderbook__InvalidMatching();
error Orderbook__TokenTransferFailed();

contract Orderbook {
    // --------- State ---------

    mapping(address => uint256) public priceIndex;

    LiquidityManager immutable lpManager;
    MockOracleClient immutable oracleClient;

    uint256 public totalOrders = 1;

    // orderId -> orders
    mapping(uint256 => Order) private orders;

    constructor(address _lpManager, address _oracleClient) {
        lpManager = LiquidityManager(_lpManager);
        oracleClient = MockOracleClient(_oracleClient);
    }

    // --------- Events ---------
    event Orderbook__OrderPlaced(
        uint256 orderId,
        uint256 amountIn,
        uint256 inPrice,
        address traderAddress,
        address inToken,
        address outToken
    );

    event Orderbook__OrderMatched(uint256 orderId, uint256 matchedLpId);

    // --------- Modifiers ---------

    // --------- Setter Functions ---------

    function placeMarketOrder(
        address _inToken,
        address _outToken,
        uint256 _amount
    ) public {
        uint256 price = getTokenPrice(_inToken, _outToken);
        uint256 orderId = totalOrders;
        totalOrders++;

        Order memory marketOrder = Order({
            orderId: orderId,
            lpId: 0,
            amountIn: _amount,
            amountOut: 0,
            inPrice: price,
            traderAddress: msg.sender,
            inToken: _inToken,
            outToken: _outToken,
            isFulfilled: false
        });
        orders[orderId] = marketOrder;

        bool success = MockERC20(_inToken).transferFrom(
            msg.sender,
            address(lpManager),
            _amount
        );

        if (!success) {
            revert Orderbook__TokenTransferFailed();
        }

        emit Orderbook__OrderPlaced(
            orderId,
            _amount,
            price,
            msg.sender,
            _inToken,
            _outToken
        );
    }

    function placeLimitOrder(
        address _inToken,
        address _outToken,
        uint256 _amount,
        uint256 _price
    ) public {
        uint256 orderId = totalOrders;
        totalOrders++;

        Order memory marketOrder = Order({
            orderId: orderId,
            lpId: 0,
            amountIn: _amount,
            amountOut: 0,
            inPrice: _price,
            traderAddress: msg.sender,
            inToken: _inToken,
            outToken: _outToken,
            isFulfilled: false
        });
        orders[orderId] = marketOrder;

        emit Orderbook__OrderPlaced(
            orderId,
            _amount,
            _price,
            msg.sender,
            _inToken,
            _outToken
        );
    }

    function matchOrder(
        uint256 _orderId,
        uint256 _lpId,
        uint256 _amountOut,
        address _tradingToken
    ) public {
        Order memory order = getOrderById(_orderId);

        LiquidityGroup memory lp = lpManager.getLiquidityPosition(_lpId);

        LiquidityToken memory tradingToken = lpManager.getTradingToken(
            _lpId,
            _tradingToken
        );

        uint256 currPrice = getTokenPrice(order.inToken, order.outToken);

        order.amountOut = _amountOut;

        if (order.outToken == _tradingToken) {
            if (
                currPrice <= tradingToken.maxPrice &&
                currPrice >= tradingToken.minPrice &&
                order.amountOut <= tradingToken.availableBalance
            ) {
                lpManager.updateLiquidityPosition(
                    _lpId,
                    order.amountOut,
                    true,
                    false,
                    _tradingToken
                );
                bool isPrimary = order.inToken == lp.primaryToken.token;
                lpManager.updateLiquidityPosition(
                    _lpId,
                    order.amountIn,
                    false,
                    isPrimary,
                    order.inToken
                );
            } else {
                revert Orderbook__InvalidMatching();
            }
        } else {
            if (
                currPrice <= lp.primaryToken.maxPrice &&
                currPrice >= lp.primaryToken.minPrice &&
                order.amountOut <= lp.primaryToken.availableBalance
            ) {
                lpManager.updateLiquidityPosition(
                    _lpId,
                    order.amountOut,
                    true,
                    true,
                    _tradingToken
                );
                bool isPrimary = order.inToken == lp.primaryToken.token;
                lpManager.updateLiquidityPosition(
                    _lpId,
                    order.amountIn,
                    false,
                    isPrimary,
                    order.inToken
                );
            } else {
                revert Orderbook__InvalidMatching();
            }
        }
        emit Orderbook__OrderMatched(order.orderId, lp.lpId);
    }

    // --------- Getter Functions ---------

    function getTokenPrice(
        address _inToken,
        address _outToken
    ) private view returns (uint256) {
        (uint256 price, uint256 decimals) = oracleClient.getDerivedValueOfPair(
            getPairId(_inToken),
            getPairId(_outToken),
            1
        );

        return price;
    }

    function getPairId(address _token) public view returns (uint256) {
        return lpManager.getTokenPairId(_token);
    }

    function getOrderById(uint256 _orderId) public view returns (Order memory) {
        return orders[_orderId];
    }
}
