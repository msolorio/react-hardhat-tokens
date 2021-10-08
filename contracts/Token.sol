//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract Token {
    string public name = 'Michael Solorio Token';
    string public symbol = 'MST';
    uint public totalSupply = 1_000_000;

    mapping(address => uint) balances;

    constructor() {
        // Adds total supply to contract owner upon contract init
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function getBalance(address account) external view returns (uint) {
        return balances[account];
    }
}
