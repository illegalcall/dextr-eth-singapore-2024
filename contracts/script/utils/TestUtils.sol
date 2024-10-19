// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockERC20} from "../../src/mocks/MockERC20.sol";

contract TestUtils is Script {
    function returnErc20() public returns (MockERC20) {
        MockERC20 token = new MockERC20("Sample", "SMPL");
        token.mint(address(1), 1 ether);
        return token;
    }
}
