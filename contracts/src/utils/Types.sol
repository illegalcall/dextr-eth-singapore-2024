// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

struct Order {
    uint256 orderId;
    uint256 lpId;
    uint256 amountIn;
    uint256 amountOut;
    uint256 inPrice;
    address traderAddress;
    address inToken;
    address outToken;
    bool isFulfilled;
}

struct LiquidityGroup {
    uint256 lpId;
    address lpAddress;
    LiquidityToken primaryToken;
}

struct LiquidityToken {
    uint256 lpId;
    address token;
    uint256 minPrice;
    uint256 maxPrice;
    uint256 availableBalance;
}
