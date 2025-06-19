// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract IskoChainCredential is ERC721URIStorage, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    // deployer gets DEFAULT_ADMIN_ROLE, can grant/revoke ADMIN_ROLEs

    uint256 public nextTokenId;

    // Revocation/Audit trail mappings
    mapping(uint256 => bool) public isRevoked;
    mapping(uint256 => string) public revocationReason;
    mapping(uint256 => uint256) public replacedByTokenId;

    event CredentialIssued(address indexed to, uint256 indexed tokenId, string tokenURI);
    event CredentialRevoked(uint256 indexed tokenId, string reason, address indexed admin);
    event CredentialReissued(uint256 indexed oldTokenId, uint256 indexed newTokenId, address indexed admin);

    constructor(address[] memory initialAdmins) ERC721("IskoChain Credential", "ISKOCRED") {
        // Deployer gets the DEFAULT_ADMIN_ROLE (super-admin)
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Grant ADMIN_ROLE to initial admins
        for (uint i = 0; i < initialAdmins.length; i++) {
            _grantRole(ADMIN_ROLE, initialAdmins[i]);
        }
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    function issueCredential(address to, string memory tokenURI) public onlyAdmin returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
        emit CredentialIssued(to, tokenId, tokenURI);
        return tokenId;
    }

    function revokeCredential(uint256 tokenId, string memory reason) public onlyAdmin {
        ownerOf(tokenId); // reverts if not exists
        require(!isRevoked[tokenId], "Already revoked");
        isRevoked[tokenId] = true;
        revocationReason[tokenId] = reason;
        emit CredentialRevoked(tokenId, reason, msg.sender);
    }

    function reissueCredential(
        uint256 oldTokenId,
        address to,
        string memory newTokenURI,
        string memory reason
    ) public onlyAdmin {
        revokeCredential(oldTokenId, reason);
        uint256 newTokenId = issueCredential(to, newTokenURI);
        replacedByTokenId[oldTokenId] = newTokenId;
        emit CredentialReissued(oldTokenId, newTokenId, msg.sender);
    }

    // --- Admin management ---
    function addAdmin(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ADMIN_ROLE, account);
    }

    function removeAdmin(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ADMIN_ROLE, account);
    }

    // Add this override at the end:
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}