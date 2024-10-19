import { ethers, Provider, Signer } from 'ethers'
import abi from './abis/MockOracleClient.json'

class MockOracleClient {
  private contract: ethers.Contract

  constructor(provider: Provider, signer: ethers.Signer, address: string) {
    this.contract = new ethers.Contract(address, abi, signer)
  }

  async getDerivedValueOfPair(pairId1: number, pairId2: number, operation: number): Promise<{ price: number; decimals: number }> {
    const { price, decimals } = await this.contract.getDerivedValueOfPair(pairId1, pairId2, operation)
    return { price: price.toNumber(), decimals: decimals.toNumber() }
  }

  async getPrice(priceIndex: number): Promise<{ price: number; decimals: number }> {
    const { price, decimals } = await this.contract.getPrice(priceIndex)
    return { price: price.toNumber(), decimals: decimals.toNumber() }
  }

  async getSupraSvalueFeed(): Promise<string> {
    return await this.contract.getSupraSvalueFeed()
  }

  async owner(): Promise<string> {
    return await this.contract.owner()
  }

  async renounceOwnership(): Promise<void> {
    const tx = await this.contract.renounceOwnership()
    await tx.wait()
  }

  async transferOwnership(newOwner: string): Promise<void> {
    const tx = await this.contract.transferOwnership(newOwner)
    await tx.wait()
  }

  async updateDerivedPricePairValues(pairIndexes1: number[], pairIndexes2: number[], prices: number[]): Promise<void> {
    const tx = await this.contract.updateDerivedPricePairValues(pairIndexes1, pairIndexes2, prices)
    await tx.wait()
  }

  async updatePricePairValues(pairs: number[], decimals: number[], prices: number[]): Promise<void> {
    const tx = await this.contract.updatePricePairValues(pairs, decimals, prices)
    await tx.wait()
  }

  async updateSupraSvalueFeed(newSValueFeed: string): Promise<void> {
    const tx = await this.contract.updateSupraSvalueFeed(newSValueFeed)
    await tx.wait()
  }
}

export default MockOracleClient
