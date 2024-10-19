// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract StakeDextr is Ownable {
    using SafeERC20 for ERC20;
    using SafeCast for uint256;

    event StakeDextr__Staked(address user, uint256 amount);
    event StakeDextr__Unstaked(address user, uint256 amount);

    ERC20 public immutable stakingToken;
    uint256 public totalStaked;
    mapping(address => uint256) public userStake;

    ERC20 public immutable rewardsToken;

    constructor(ERC20 _stakingToken, ERC20 _rewardsToken) Ownable(msg.sender) {
        stakingToken = _stakingToken;
        rewardsToken = _rewardsToken;
    }

    function _stake(address user, uint256 amount) internal {
        totalStaked += amount;
        userStake[user] += amount;
        stakingToken.safeTransferFrom(user, address(this), amount);

        emit StakeDextr__Staked(user, amount);
    }

    function _unstake(address user, uint256 amount) internal {
        totalStaked -= amount;
        userStake[user] -= amount;
        stakingToken.safeTransfer(user, amount);

        emit StakeDextr__Unstaked(user, amount);
    }

    function stake(uint256 amount) public virtual {
        _stake(msg.sender, amount);
    }

    function unstake(uint256 amount) public virtual {
        _unstake(msg.sender, amount);
    }
}
