# 🖼 NFT Minting & Marketplace DApp — Ethereum

![Solidity](https://img.shields.io/badge/Solidity-ERC--721-363636?style=flat&logo=solidity)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Contracts-4E5EE4?style=flat)
![Truffle](https://img.shields.io/badge/Framework-Truffle-5E464D?style=flat)
![IPFS](https://img.shields.io/badge/Storage-IPFS-65C2CB?style=flat)

A full-stack NFT minting and marketplace DApp built on Ethereum. Implements the ERC-721 standard with on-chain ownership, IPFS-based metadata storage, and a frontend minting interface — covering the complete NFT lifecycle from creation to transfer.

---

## Standards implemented

| Standard | Description |
|---|---|
| ERC-721 | Non-fungible token standard — unique token IDs, ownership tracking |
| OpenZeppelin | Battle-tested base contracts — access control, safe transfer hooks |
| IPFS metadata | Decentralised asset & metadata storage — content-addressable URIs |
| On-chain provenance | Immutable ownership history — transfer events, minter attribution |

---

## Key features

- **ERC-721 compliant minting** — unique token IDs with full ownership tracking
- **IPFS integration** — decentralised metadata and asset storage, content-addressable URIs
- **On-chain provenance** — immutable transfer history and minter attribution via events
- **Frontend minting UI** — HTML/JS interface connected to contracts via Web3.js
- **Contract test suite** — unit tests with Truffle

---

## Quick start

```bash
git clone https://github.com/monickark/eth_nft
cd eth_nft
npm install
cp .env.example .env   # add your private key and Infura/Alchemy API key
truffle migrate --network sepolia
npm start
```

---

## Project structure

```
eth_nft/
├── contracts/       # ERC-721 Solidity smart contracts
├── migrations/      # Truffle deployment scripts
├── test/            # Contract test suite
└── src/             # Frontend DApp (HTML/CSS/JS)
```

---

## Built by

[Monicka Akilan](https://github.com/monickark) — Blockchain Architect · Smart Contract Engineer
[![LinkedIn](https://img.shields.io/badge/LinkedIn-monickark-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/monickark/)
