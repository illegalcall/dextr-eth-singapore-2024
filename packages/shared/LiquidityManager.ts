import { ethers, Provider, Signer, Contract } from 'ethers'
import abi from './abis/LiquidityManagerABI.json'
interface LiquidityToken {
  lpId: number
  token: string
  minPrice: number
  maxPrice: number
  availableBalance: number
}

interface LiquidityGroup {
  lpId: number
  lpAddress: string
  primaryToken: LiquidityToken
}

class LiquidityManager {
  private contract: Contract
  private provider: Provider
  private signer: Signer

  constructor(provider: Provider, signer: Signer, address: string) {
    this.provider = provider
    this.signer = signer
    this.contract = new Contract(address, abi, signer)
  }

  async createLiquidityPosition(
    primaryToken: string,
    minPrice: number,
    maxPrice: number,
    amount: number,
    tradingTokens: string[],
    tradingMinTokens: number[],
    tradingMaxTokens: number[]
  ): Promise<void> {
    const tx = await this.contract.createLiquidityPosition(
      primaryToken,
      minPrice,
      maxPrice,
      amount,
      tradingTokens,
      tradingMinTokens,
      tradingMaxTokens
    )
    await tx.wait()
  }

  async getLiquidityPosition(lpId: number): Promise<LiquidityGroup> {
    const result = await this.contract.getLiquidityPosition(lpId)
    return result as LiquidityGroup
  }

  async getTokenPairId(token: string): Promise<number> {
    const pairId = await this.contract.getTokenPairId(token)
    return pairId.toNumber()
  }

  async getTradingToken(lpId: number, token: string): Promise<LiquidityToken> {
    const tradingToken = await this.contract.getTradingToken(lpId, token)
    return tradingToken as LiquidityToken
  }

  async isTokenSupported(tokenAddress: string): Promise<boolean> {
    return await this.contract.isTokenSupported(tokenAddress)
  }

  async removeLiquidityPosition(
    lpId: number,
    tradingTokens: string[],
    recipient: string
  ): Promise<void> {
    const tx = await this.contract.removeLiquidityPosition(lpId, tradingTokens, recipient)
    await tx.wait()
  }

  async totalLP(): Promise<number> {
    const total = await this.contract.totalLP()
    return total.toNumber()
  }

  async updateLiquidityPosition(
    lpId: number,
    amount: number,
    deduct: boolean,
    isPrimary: boolean,
    tradingToken: string
  ): Promise<void> {
    const tx = await this.contract.updateLiquidityPosition(lpId, amount, deduct, isPrimary, tradingToken)
    await tx.wait()
  }
}

export default LiquidityManager
