import { ethers, Provider, Signer, Contract } from 'ethers'
import abi from './abis/OrderbookABI.json'

interface Order {
  orderId: number
  lpId: number
  amountIn: number
  amountOut: number
  inPrice: number
  traderAddress: string
  inToken: string
  outToken: string
  isFulfilled: boolean
}

class Orderbook {
  private contract: ethers.Contract

  constructor(provider: Provider, signer: Signer, address: string, lpManager: string, oracleClient: string) {
    this.contract = new Contract(address, abi, signer)
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.contract.getOrderById(orderId)
    return {
      orderId: order.orderId.toNumber(),
      lpId: order.lpId.toNumber(),
      amountIn: order.amountIn.toNumber(),
      amountOut: order.amountOut.toNumber(),
      inPrice: order.inPrice.toNumber(),
      traderAddress: order.traderAddress,
      inToken: order.inToken,
      outToken: order.outToken,
      isFulfilled: order.isFulfilled,
    }
  }

  async getPairId(token: string): Promise<number> {
    const pairId = await this.contract.getPairId(token)
    return pairId.toNumber()
  }

  async matchOrder(orderId: number, lpId: number, amountOut: number, tradingToken: string): Promise<void> {
    const tx = await this.contract.matchOrder(orderId, lpId, amountOut, tradingToken)
    await tx.wait()
  }

  async placeLimitOrder(inToken: string, outToken: string, amount: number, price: number): Promise<void> {
    const tx = await this.contract.placeLimitOrder(inToken, outToken, amount, price)
    await tx.wait()
  }

  async placeMarketOrder(inToken: string, outToken: string, amount: number): Promise<void> {
    const tx = await this.contract.placeMarketOrder(inToken, outToken, amount)
    await tx.wait()
  }

  async priceIndex(token: string): Promise<number> {
    const index = await this.contract.priceIndex(token)
    return index.toNumber()
  }

  async totalOrders(): Promise<number> {
    const total = await this.contract.totalOrders()
    return total.toNumber()
  }
}

export default Orderbook
