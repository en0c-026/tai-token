# TAI Token

This repository contains the source code for the TAI Token. TAI is a BEP20 token on the Binance Smart Chain that is used to incentivize and reward users of the TAI Platform.

## Clone the Repository

To clone the repository, run the following command:
```bash
git clone https://github.com/en0c-026/tai-token.git
```

## Install Packages

To install the required packages, run the following command:

```bash
yarn install
```

## Compile Contracts

To compile the contracts, run the following command:

```bash
npx hardhat compile
```

## Run Tests

To run the tests, run the following command:

```bash
npx hardhat test
```

## Configure .env

Rename the `.env.example` file to `.env` and fill in the `PRIVATE_KEY` field with your private key.

## Deploying to network

To deploy the TAI Token to the Binance Smart Chain, run the following command:
```bash
npx hardhat run scripts/deploy.js --network <networkName>
```
Replace `<networkName>` with either `bsc` or `bscTestnet` depending on which network you want to deploy to.


