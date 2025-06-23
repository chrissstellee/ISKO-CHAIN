// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract IskoChainCredential is ERC721URIStorage, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public nextTokenId;

    // Revocation/Audit trail mappings
    mapping(uint256 => bool) public isRevoked;
    mapping(uint256 => string) public revocationReason;
    mapping(uint256 => uint256) public replacedByTokenId;

    // Enforce 1 active Degree Certificate per studentId
    mapping(string => uint256) public activeDegreeCertificate;

    // Store studentId and credentialType for each token
    mapping(uint256 => string) public tokenStudentId;
    mapping(uint256 => string) public tokenCredentialType;

    event CredentialIssued(address indexed to, uint256 indexed tokenId, string tokenURI, string studentId, string credentialType);
    event CredentialRevoked(uint256 indexed tokenId, string reason, address indexed admin, string studentId, string credentialType);
    event CredentialReissued(uint256 indexed oldTokenId, uint256 indexed newTokenId, address indexed admin, string studentId);

    constructor(address[] memory initialAdmins) ERC721("IskoChain Credential", "ISKOCRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        for (uint i = 0; i < initialAdmins.length; i++) {
            _grantRole(ADMIN_ROLE, initialAdmins[i]);
        }
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    /// @notice Issue a credential NFT to a student.
    /// @dev Only one active Degree Certificate per studentId is allowed.
    function issueCredential(
        address to,
        string memory tokenURI,
        string memory studentId,
        string memory credentialType
    ) public onlyAdmin returns (uint256) {
        if (_isDegreeCertificate(credentialType)) {
            uint256 existingTokenId = activeDegreeCertificate[studentId];
            // Block if existing token is present and not revoked
            if (existingTokenId != 0 && !isRevoked[existingTokenId]) {
                revert("Student already has an active Degree Certificate");
            }
        }
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenStudentId[tokenId] = studentId;
        tokenCredentialType[tokenId] = credentialType;
        nextTokenId++;

        if (_isDegreeCertificate(credentialType)) {
            activeDegreeCertificate[studentId] = tokenId;
        }

        emit CredentialIssued(to, tokenId, tokenURI, studentId, credentialType);
        return tokenId;
    }

    /// @notice Revoke a credential NFT.
    function revokeCredential(
        uint256 tokenId,
        string memory reason
    ) public onlyAdmin {
        ownerOf(tokenId); // reverts if not exists
        require(!isRevoked[tokenId], "Already revoked");
        isRevoked[tokenId] = true;
        revocationReason[tokenId] = reason;

        // If Degree Certificate, clear student mapping if needed
        string memory studentId = tokenStudentId[tokenId];
        string memory credentialType = tokenCredentialType[tokenId];
        if (_isDegreeCertificate(credentialType) && activeDegreeCertificate[studentId] == tokenId) {
            activeDegreeCertificate[studentId] = 0;
        }

        emit CredentialRevoked(tokenId, reason, msg.sender, studentId, credentialType);
    }

    /// @notice Reissue a credential (revoke old, mint new with same studentId/type).
    function reissueCredential(
        uint256 oldTokenId,
        address to,
        string memory newTokenURI,
        string memory reason
    ) public onlyAdmin {
        // Get info from old token
        string memory studentId = tokenStudentId[oldTokenId];
        string memory credentialType = tokenCredentialType[oldTokenId];

        // Revoke old
        revokeCredential(oldTokenId, reason);
        // Mint new
        uint256 newTokenId = issueCredential(to, newTokenURI, studentId, credentialType);
        replacedByTokenId[oldTokenId] = newTokenId;
        emit CredentialReissued(oldTokenId, newTokenId, msg.sender, studentId);
    }

    // --- Admin management ---
    function addAdmin(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ADMIN_ROLE, account);
    }

    function removeAdmin(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ADMIN_ROLE, account);
    }

    function _isDegreeCertificate(string memory credentialType) internal pure returns (bool) {
        // Check for exact match (case-sensitive, should match frontend/backend spelling)
        return (keccak256(bytes(credentialType)) == keccak256(bytes("Degree Certificate")));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
