// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";
import {LiquidityManager} from "../../src/LiquidityManager.sol";
import {DxtrRep} from "../../src/DxtrRep.sol";
import {Orderbook} from "../../src/Orderbook.sol";
import {StakeDextr} from "../../src/Stake.sol";
import {MockOracleClient} from "../../src/mocks/MockOracleClient.sol";
import {UserRegistry} from "../../src/UserRegistry.sol";

uint8 constant NUM_TOKENS = 4;

contract DeployAllTokens is Script {
    function run() external {
        // Create an array to hold the token addresses
        address[NUM_TOKENS] memory tokenAddresses;
        uint256[NUM_TOKENS] memory pairIds;

        // Start broadcasting the transactions
        vm.startBroadcast();

        // Deploy Token 1 (USDC)
        MockERC20 usdc = new MockERC20("USD Circle", "USDC");
        tokenAddresses[0] = address(usdc); // Store the address
        pairIds[0] = 89;
        console.log("USD Circle deployed at:", address(usdc));

        // Deploy Token 2 (WETH)
        MockERC20 weth = new MockERC20("Wrapped Ethereum", "WETH");
        tokenAddresses[1] = address(weth); // Store the address
        pairIds[1] = 19;
        console.log("Wrapped Ethereum deployed at:", address(weth));

        // Deploy Token 3 (WBNB)
        MockERC20 wbtc = new MockERC20("Wrapped BNB", "WBNB");
        tokenAddresses[2] = address(wbtc); // Store the address
        pairIds[2] = 49;
        console.log("Wrapped Bitcoin deployed at:", address(wbtc));

        // Deploy Token 4 (DEXTR)
        MockERC20 dxtr = new MockERC20("Dextr", "DEXTR");
        tokenAddresses[3] = address(dxtr); // Store the address
        pairIds[3] = 89;
        console.log("Dextr deployed at:", address(dxtr));

        MockOracleClient oracleClient = new MockOracleClient(address(1));
        console.log("MockOracleClient deployed at:", address(oracleClient));

        address[] memory supportedTokens = new address[](4);
        uint256[] memory pairs = new uint256[](4);
        for (uint i = 0; i < tokenAddresses.length; i++) {
            supportedTokens[i] = tokenAddresses[i];
            pairs[i] = pairIds[i];
        }

        LiquidityManager liquidityManager = new LiquidityManager(
            supportedTokens,
            pairs
        );
        console.log("MockOracleClient deployed at:", address(oracleClient));

        Orderbook orderbook = new Orderbook(
            address(liquidityManager),
            address(oracleClient)
        );
        console.log("Orderbook deployed at:", address(orderbook));

        DxtrRep repSBT = new DxtrRep();
        console.log("DxtrRep deployed at:", address(repSBT));

        StakeDextr stake = new StakeDextr(dxtr, repSBT);
        console.log("StakeDextr deployed at:", address(stake));


        UserRegistry userRegistry = new UserRegistry(dxtr, address(stake));
        console.log("UserRegistry deployed at:", address(userRegistry));


        address[5] memory recipients = [
            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, // Replace with valid addresses
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
            0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
            0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
        ];
        uint256 amountToMint = 1000 * 10**18; // Amount of tokens to mint per address

        for (uint i = 0; i < recipients.length; i++) {
            dxtr.mint(recipients[i], amountToMint);
            uint256 balance = dxtr.balanceOf(recipients[i]);
            console.log("Balance of recipient", recipients[i], ":", balance);
        }

        // Stop broadcasting
        vm.stopBroadcast();
    }
}
