// SPDX-License-Identifier: MIT
///////////////////////////////////////////////////////////////////////////////

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

contract NTXToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("NTXToken", "NTX") {
        _mint(msg.sender, initialSupply);
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
