// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// --------- Errors ---------

error DxtrRep__IsSBT();

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DxtrRep is ERC20, Ownable {
    event DxtrRep_MintSBT(address indexed recipient, uint256 amount);

    constructor() ERC20("Dextr Rep SBTs", "DREP") Ownable(msg.sender) {}

    modifier isSoulbound() {
        revert DxtrRep__IsSBT();
        _;
    }

    function mint(address _recipient, uint256 _amount) external onlyOwner {
        _mint(_recipient, _amount);
        emit DxtrRep_MintSBT(_recipient, _amount);
    }

    function transfer(
        address,
        uint256
    ) public virtual override isSoulbound returns (bool) {
        return false;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public virtual override isSoulbound returns (bool) {
        return false;
    }
}
