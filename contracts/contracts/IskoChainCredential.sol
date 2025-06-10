// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ISKO-CHAIN Credential NFT Contract
 * - Each NFT (credential) has its own tokenURI (points to IPFS metadata)
 * - Only the contract owner (admin) can issue and revoke credentials
 */
contract IskoChainCredential is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("IskoChain Credential", "ISKOCRED") Ownable(msg.sender) {}

    function issueCredential(address to, string memory tokenURI) public onlyOwner {
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;
    }

    function revokeCredential(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }
}
