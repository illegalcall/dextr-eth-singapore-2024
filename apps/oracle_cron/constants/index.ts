import { config } from 'dotenv'

config()

export { abi as MockOracleABI } from './MockOracle.json'

export { abi as OracleProofABI } from './OracleProof.json'

export const CHAIN_ID = '31337'
export const ADMIN_PRIVATE_KEY =
  process.env.ADMIN_PRIVATE_KEY ||
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
export const MOCK_ORACLE_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
export const CHAIN_INFO = {
  '80002': {
    rpcUrl: 'https://rpc-amoy.polygon.technology',
  },
  '80084': {
    rpcUrl: 'https://bartio.rpc.berachain.com/',
  },
  '31337': {
    rpcUrl: 'http://127.0.0.1:8545',
  },
}

export const REST_ADDRESS = 'https://rpc-testnet-dora-2.supra.com'

// BTC_USD ETH_USD POL_USD BNB_USDT USDC_USD
export const PAIR_INDEXES = [18, 19, 197, 49, 89]
export const CHAIN_TYPE = 'evm'
