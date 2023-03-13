// SPDX-License-Identifier: MIT
///////////////////////////////////////////////////////////////////////////////

pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

contract NTXCertificate is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("NTXCertificate", "NTXC") {}

    function publish(address author, string memory tokenURI)
        public returns (uint256)
    {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(author, id);
        _setTokenURI(id, tokenURI);

        return id;
    }

    function burn(uint256 tokenId)
        public
    {
        require(_isApprovedOrOwner(msg.sender, tokenId));
        _burn(tokenId);
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
