import { JsonRpcProvider } from 'ethers'
import { ADMIN_PRIVATE_KEY, CHAIN_ID, CHAIN_INFO } from '../constants'
import { Signer } from 'ethers'
import { Wallet } from 'ethers'

export const getProvider = (): JsonRpcProvider => {
  return new JsonRpcProvider(CHAIN_INFO[CHAIN_ID].rpcUrl)
}

export const getAdminSigner = (): Signer => {
  return new Wallet(ADMIN_PRIVATE_KEY).connect(getProvider())
}
