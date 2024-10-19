# Dextr: A Hybrid Exchange for Dynamic Liquidity Rotation

## Overview

Dextr is designed to address two primary challenges faced by Liquidity Providers (LPs) and Decentralized Exchanges (DEXs): Loss-versus-Rebalancing (LVR) and liquidity being locked in low-volume pools. By utilizing Oracle Prices instead of traditional curves, Dextr enables Dynamic Liquidity Rotation, allowing assets to be settled efficiently across various market sectors.

## Key Features

- **Minimized LVR**: Leverages Oracle Prices for more stable trading outcomes.
- **Dynamic Liquidity Rotation**: Facilitates the use of assets locked in pools for trades in higher-volume markets.
- **Flexible Trading**: Users can select price ranges and secondary tokens for trades.
- **Decentralized Order Matching**: Utilizes Eigen Layer AVS operators (Othentic) for off-chain order matching.
- **Security through Slashing**: Malicious activities by operators result in slashing of their stake, ensuring accountability.

## Project Structure

### 1. Smart Contracts

- **Foundry Development**: Smart contracts are built using Foundry.
- **Singleton Contract**: Manages tokens and liquidity positions for each LP.
- **Orderbook**: Handles all order-related tasks.
- **Airdrop Mechanism**: Tokens can be distributed via a faucet.
- **Dextr REP**: A Soulbound Token (SBT) that determines an LP's eligibility to settle trades.
- **Oracle Client**: A mock contract simulating Supra Oracle Contracts.

### 2. Off-Chain Components

- **Backend Listener**: Monitors on-chain activity and stores it in a database.
- **Oracle Cronjob**: Regularly updates token prices on-chain.
- **Executioner Service**: Manages transactions sent to the blockchain.

### 3. On-Chain Computing

- **Othentic Operators**: A decentralized network of operators staking tokens to the Eigen Protocol to settle trades.
- **Execution Oversight**: While one operator settles trades, others run algorithms to ensure transaction integrity.
- **Brevis Network**: Provides the ability to prove historical data on-chain, enhancing oversight of operators.

## Conclusion

Dextr aims to revolutionize the DEX landscape by offering a hybrid exchange that mitigates the challenges of LVR and liquidity management. Through innovative mechanisms and a robust architecture, Dextr empowers LPs and traders alike.

For more details, watch our [introductory video](https://youtu.be/kLBIWr4eiGQ).

