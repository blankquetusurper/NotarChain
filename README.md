# NotarChain

A decentralized blockchain-based notary and document verification system that brings secure, transparent, and tamper-proof notarization to the digital age — all on-chain.

---

## Overview

NotarChain consists of ten main smart contracts that together form a trusted ecosystem for document notarization, identity verification, and delegated signing:

1. **Document Registry Contract** – Registers document hashes with metadata and timestamps.
2. **Signature Validator Contract** – Enables cryptographic signing, multi-sig, and delegated authority.
3. **Identity Manager Contract** – Verifies and links decentralized identities (DIDs).
4. **Notary License Contract** – Maintains a registry of licensed notaries and validators.
5. **Document Access Control Contract** – Manages read/write permissions and access policies.
6. **Document Versioning Contract** – Tracks and validates document revisions and history.
7. **Dispute Resolution Contract** – Resolves conflicts related to forgery, revocation, or ownership.
8. **Fee Manager Contract** – Handles platform fees, pricing tiers, and subsidy models.
9. **Governance DAO Contract** – Manages protocol changes, validator onboarding, and fees.
10. **Storage Pointer Manager Contract** – Maps document hashes to off-chain storage URIs securely.

---

## Features

- **On-chain notarization** with timestamp and immutability  
- **Decentralized identity verification** (DIDs & KYC optional)  
- **Delegated and multi-party signatures** with audit trails  
- **Permissioned document sharing** using access control  
- **Tamper-proof version tracking** for document updates  
- **Dispute resolution** for forgery and ownership claims  
- **Flexible fee models** with DAO-managed updates  
- **Encrypted storage mapping** (IPFS, Arweave, etc.)  
- **Public proof-of-existence and verification**  
- **Licensed notary registry** for jurisdictional compliance  

---

## Smart Contracts

### Document Registry Contract
- Register and timestamp document hashes
- Store metadata (e.g., doc type, jurisdiction)
- Verify existence without revealing contents

### Signature Validator Contract
- Verify signer identity and digital signatures
- Support multi-signature workflows
- Enable delegated signing via permissions

### Identity Manager Contract
- Map addresses to verified identities (DIDs)
- Support KYC/identity attestations
- Identity revocation and expiration handling

### Notary License Contract
- Register, update, or revoke notary status
- Stake-based validation system
- Jurisdictional licensing logic

### Document Access Control Contract
- Define read/write permissions
- Link encrypted key shares with users
- Support expiration and revocation

### Document Versioning Contract
- Link new versions to original hash
- Prevent duplicate or conflicting claims
- View audit trail of all changes

### Dispute Resolution Contract
- Flag and resolve forgery or impersonation disputes
- Community voting or arbitration logic
- Token slashing for fraudulent actors

### Fee Manager Contract
- Configure notarization and signing fees
- Apply discounts or subsidies via DAO
- Token-based fee payment support

### Governance DAO Contract
- Propose and vote on upgrades or policy changes
- Elect or remove validators and notaries
- Control treasury and fee logic

### Storage Pointer Manager Contract
- Map doc hashes to IPFS/Arweave URIs
- Track encryption keys off-chain (optional)
- Allow deletion signals without erasing history

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/notarchain.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

---

## Usage

Each smart contract serves a distinct role in the notarization lifecycle — from document registration to signature validation and governance. Contracts are modular and can operate independently or in combination, depending on jurisdictional and privacy needs.

Refer to the individual contract documentation for function calls, Clarity interface definitions, and integration examples.

---

## License

MIT License