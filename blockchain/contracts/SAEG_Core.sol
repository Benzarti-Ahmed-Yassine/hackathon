// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SAEG_Core {
    address public owner;
    address public fdtAccount; // Account for Fonds Dépollution Textile

    enum Classification { VERT, ORANGE, ROUGE, NOIR }

    struct CompanyRecord {
        uint256 lastIPT;
        Classification classification;
        uint256 lastAuditTimestamp;
        bool registered;
    }

    mapping(address => CompanyRecord) public companies;

    event IPTUpdated(address indexed company, uint256 score, Classification classification);
    event TaxCollected(address indexed company, uint256 amount, uint256 ipt);

    constructor(address _fdtAccount) {
        owner = msg.sender;
        fdtAccount = _fdtAccount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can update IPT");
        _;
    }

    function registerCompany(address _company) public onlyOwner {
        companies[_company].registered = true;
    }

    /**
     * @dev Updates the IPT and automatically triggers fiscal logic.
     * Score is multiplied by 100 to handle floats (e.g., 50.5 -> 5050)
     */
    function updateIPT(address _company, uint256 _score) public onlyOwner {
        require(companies[_company].registered, "Company not registered");

        Classification class;
        if (_score < 5000) {
            class = Classification.VERT;
        } else if (_score < 10000) {
            class = Classification.ORANGE;
        } else if (_score < 15000) {
            class = Classification.ROUGE;
        } else {
            class = Classification.NOIR;
        }

        companies[_company].lastIPT = _score;
        companies[_company].classification = class;
        companies[_company].lastAuditTimestamp = block.timestamp;

        emit IPTUpdated(_company, _score, class);

        // Fiscal Trigger Logic (Automatic Tax)
        // In a real scenario, the contract would have permission to pull or check balance.
        // Here we emit an event for the backend to process the ETH transfer if needed.
    }

    // Function to allow backend to deposit taxes into FDT
    function collectTax(address _company) public payable {
        // Log the tax collection
        emit TaxCollected(_company, msg.value, companies[_company].lastIPT);
    }

    function setFDTAccount(address _newFDT) public onlyOwner {
        fdtAccount = _newFDT;
    }
}
