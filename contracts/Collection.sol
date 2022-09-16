// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/// @title Collection contract that distributes incentive fees to voters of Sarco DAO proposals

contract Collection {

    address public owner;

    constructor() {
        owner = msg.sender;   
    }

}