// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GigPeek
 * @dev A decentralized platform for gig economy transactions with escrow and proof-of-work verification
 */
contract GigPeek is ReentrancyGuard {
    
    enum DealStatus {
        Active,         // 0 - Deal created, funds escrowed
        ProofSubmitted, // 1 - Contractor has submitted proof
        Completed       // 2 - Client has released funds
    }
    
    struct Deal {
        address client;
        address contractor;
        uint256 amount;
        string workDescription;
        bytes32 proofHash;          // keccak256 hash of the work preview
        DealStatus status;
        uint256 createdAt;
        uint256 proofSubmittedAt;
    }
    
    // State Variables
    Deal[] public deals;
    mapping(address => uint256[]) public clientDeals;
    mapping(address => uint256[]) public contractorDeals;
    
    // Events
    event DealCreated(
        uint256 indexed dealId,
        address indexed client,
        address indexed contractor,
        uint256 amount,
        string workDescription
    );
    
    event ProofSubmitted(
        uint256 indexed dealId,
        address indexed contractor,
        bytes32 proofHash
    );
    
    event PaymentReleased(
        uint256 indexed dealId,
        address indexed contractor,
        uint256 amount
    );
    
    // Modifiers
    modifier dealExists(uint256 _dealId) {
        require(_dealId < deals.length, "Deal does not exist");
        _;
    }
    
    modifier onlyClient(uint256 _dealId) {
        require(msg.sender == deals[_dealId].client, "Only client can perform this action");
        _;
    }
    
    modifier onlyContractor(uint256 _dealId) {
        require(msg.sender == deals[_dealId].contractor, "Only contractor can perform this action");
        _;
    }
    
    /**
     * @dev Creates a new deal with escrow
     * @param _contractor The Ethereum address of the contractor
     * @param _workDescription A clear description of the work to be done
     */
    function createDeal(
        address _contractor,
        string calldata _workDescription
    ) external payable {
        require(msg.value > 0, "Deal amount must be greater than 0");
        require(_contractor != address(0), "Invalid contractor address");
        require(_contractor != msg.sender, "Client and contractor cannot be the same");
        require(bytes(_workDescription).length > 0, "Work description cannot be empty");
        
        uint256 dealId = deals.length;
        
        Deal memory newDeal = Deal({
            client: msg.sender,
            contractor: _contractor,
            amount: msg.value,
            workDescription: _workDescription,
            proofHash: bytes32(0),
            status: DealStatus.Active,
            createdAt: block.timestamp,
            proofSubmittedAt: 0
        });
        
        deals.push(newDeal);
        clientDeals[msg.sender].push(dealId);
        contractorDeals[_contractor].push(dealId);
        
        emit DealCreated(dealId, msg.sender, _contractor, msg.value, _workDescription);
    }
    
    /**
     * @dev Allows contractor to submit proof of work
     * @param _dealId The ID of the deal to submit proof for
     * @param _proofHash The keccak256 hash of the work preview
     */
    function submitProof(
        uint256 _dealId,
        bytes32 _proofHash
    ) external dealExists(_dealId) onlyContractor(_dealId) {
        require(deals[_dealId].status == DealStatus.Active, "Deal is not active");
        require(_proofHash != bytes32(0), "Proof hash cannot be empty");
        
        deals[_dealId].proofHash = _proofHash;
        deals[_dealId].status = DealStatus.ProofSubmitted;
        deals[_dealId].proofSubmittedAt = block.timestamp;
        
        emit ProofSubmitted(_dealId, msg.sender, _proofHash);
    }
    
    /**
     * @dev Allows client to release payment to contractor
     * @param _dealId The ID of the deal to release payment for
     */
    function releasePayment(
        uint256 _dealId
    ) external dealExists(_dealId) onlyClient(_dealId) nonReentrant {
        require(deals[_dealId].status == DealStatus.ProofSubmitted, "Proof not submitted yet");
        
        Deal storage deal = deals[_dealId];
        deal.status = DealStatus.Completed;
        
        uint256 amount = deal.amount;
        address contractor = deal.contractor;
        
        // Transfer ETH to contractor
        (bool success, ) = contractor.call{value: amount}("");
        require(success, "Payment transfer failed");
        
        emit PaymentReleased(_dealId, contractor, amount);
    }
    
    // View Functions
    
    /**
     * @dev Returns an array of deal IDs where the specified address is the client
     * @param _client The client address to query
     * @return Array of deal IDs
     */
    function getDealsByClient(address _client) external view returns (uint256[] memory) {
        return clientDeals[_client];
    }
    
    /**
     * @dev Returns an array of deal IDs where the specified address is the contractor
     * @param _contractor The contractor address to query
     * @return Array of deal IDs
     */
    function getDealsByContractor(address _contractor) external view returns (uint256[] memory) {
        return contractorDeals[_contractor];
    }
    
    /**
     * @dev Returns the full Deal struct for a given deal ID
     * @param _dealId The deal ID to query
     * @return The Deal struct
     */
    function getDeal(uint256 _dealId) external view dealExists(_dealId) returns (Deal memory) {
        return deals[_dealId];
    }
    
    /**
     * @dev Returns the total number of deals created
     * @return Total number of deals
     */
    function getTotalDeals() external view returns (uint256) {
        return deals.length;
    }
    
    /**
     * @dev Returns contract balance (for testing purposes)
     * @return Contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
