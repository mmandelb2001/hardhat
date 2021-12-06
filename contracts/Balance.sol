// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ERC20Interface {
    function balanceOf(address whom) external returns (uint);
}

abstract contract Balance is ERC20Interface{

    address wallet;

    constructor(address _walletAddress) {
        wallet = _walletAddress;
    }
    
    function queryERC20Balance(address _tokenAddress) public returns (uint) {
        return ERC20Interface(_tokenAddress).balanceOf(wallet);
    }
  
}
