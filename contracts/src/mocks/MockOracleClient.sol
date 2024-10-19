// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "../interface/ISupraSValueFeed.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error OracleClient__InvaildOp();

contract MockOracleClient is Ownable {
    struct priceFeedData {
        uint256 round;
        uint256 decimals;
        uint256 time;
        uint256 price;
    }

    struct derivedPriceData {
        int256 roundDifference;
        uint256 derivedPrice;
        uint256 decimals;
    }

    ISupraSValueFeed internal sValueFeed;

    mapping(uint256 => priceFeedData) priceFeedIndex;
    mapping(uint256 => mapping(uint256 => derivedPriceData)) derivedPriceFeedIndex;

    constructor(address _sValueFeed) Ownable(msg.sender) {
        sValueFeed = ISupraSValueFeed(_sValueFeed);
    }

    function updateSupraSvalueFeed(
        ISupraSValueFeed _newSValueFeed
    ) external onlyOwner {
        sValueFeed = _newSValueFeed;
    }

    function getSupraSvalueFeed() external view returns (ISupraSValueFeed) {
        return sValueFeed;
    }

    function getPrice(
        uint256 _priceIndex
    ) external view returns (uint256 price, uint256 decimals) {
        return (
            priceFeedIndex[_priceIndex].price,
            priceFeedIndex[_priceIndex].decimals
        );
    }

    function getDerivedValueOfPair(
        uint256 pair_id_1,
        uint256 pair_id_2,
        uint256 operation
    ) external view returns (uint256 price, uint256 decimals) {
        if (operation != 0 && operation != 1) revert OracleClient__InvaildOp();
        price = derivedPriceFeedIndex[pair_id_1][pair_id_2].derivedPrice;
        decimals = derivedPriceFeedIndex[pair_id_1][pair_id_2].decimals;
    }

    function updatePricePairValues(
        uint256[] memory pairs,
        uint256[] memory decimals,
        uint256[] memory prices
    ) public {
        for (uint256 i; i < pairs.length; i++) {
            priceFeedIndex[pairs[i]].price = prices[i];
            priceFeedIndex[pairs[i]].decimals = decimals[i];
        }
    }

    function updateDerivedPricePairValues(
        uint256[] memory pairIndexs1, // ETH
        uint256[] memory pairIndexs2, // USDC
        uint256[] memory prices
    ) public {
        for (uint256 i; i < pairIndexs1.length; i++) {
            derivedPriceFeedIndex[pairIndexs1[i]][pairIndexs2[i]]
                .derivedPrice = prices[i];
            derivedPriceFeedIndex[pairIndexs1[i]][pairIndexs2[i]].decimals = 18;
        }
    }
}
