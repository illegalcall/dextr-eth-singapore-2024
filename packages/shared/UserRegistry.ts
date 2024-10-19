import { ethers, Provider, Signer, Contract } from 'ethers'

import abi from './abis/UserRegistryABI.json' // Ensure the ABI is saved in this path

class UserRegistry {
  private contract: Contract
  private provider: Provider
  private signer: Signer

  constructor(provider: Provider, signer: Signer, address: string) {
    this.provider = provider
    this.signer = signer
    this.contract = new Contract(address, abi, signer)
  }

  async isUserRegistered(user: string): Promise<boolean> {
    return await this.contract.isUserRegistered(user)
  }

  async registerUser(): Promise<void> {
    const tx = await this.contract.registerUser()
    await tx.wait()
  }

  async getStakedToken(): Promise<string> {
    return await this.contract.stakedToken()
  }

  async getStakingContract(): Promise<string> {
    return await this.contract.stakingContract()
  }

  async getUserRegistry(user: string): Promise<boolean> {
    return await this.contract.userRegistry(user)
  }

  async onUserRegistered(callback: (user: string) => void): Promise<void> {
    this.contract.on('UserRegistered', (user: string) => {
      callback(user)
    })
  }

  async removeUserRegisteredListener(callback: (user: string) => void): Promise<void> {
    this.contract.off('UserRegistered', callback)
  }
}

export default UserRegistry
