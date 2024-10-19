import { ethers, Provider, Signer, Contract } from 'ethers'

import abi from './abis/MockERC20ABI.json'
class MockERC20 {
  private contract: Contract

  constructor(provider: Provider, signer: Signer, address: string, name: string, symbol: string) {
    this.contract = new Contract(address, abi, signer)
  }

  async allowance(owner: string, spender: string): Promise<number> {
    const allowance = await this.contract.allowance(owner, spender)
    return allowance.toNumber()
  }

  async approve(spender: string, value: number): Promise<boolean> {
    const tx = await this.contract.approve(spender, value)
    await tx.wait()
    return tx.wait().status === 1 // true if the transaction was successful
  }

  async balanceOf(account: string): Promise<number> {
    const balance = await this.contract.balanceOf(account)
    return balance.toNumber()
  }

  async decimals(): Promise<number> {
    const decimals = await this.contract.decimals()
    return decimals.toNumber()
  }

  async mint(to: string, amount: number): Promise<void> {
    const tx = await this.contract.mint(to, amount)
    await tx.wait()
  }

  async name(): Promise<string> {
    return await this.contract.name()
  }

  async symbol(): Promise<string> {
    return await this.contract.symbol()
  }

  async totalSupply(): Promise<number> {
    const totalSupply = await this.contract.totalSupply()
    return totalSupply.toNumber()
  }

  async transfer(to: string, value: number): Promise<boolean> {
    const tx = await this.contract.transfer(to, value)
    await tx.wait()
    return tx.wait().status === 1 // true if the transaction was successful
  }

  async transferFrom(from: string, to: string, value: number): Promise<boolean> {
    const tx = await this.contract.transferFrom(from, to, value)
    await tx.wait()
    return tx.wait().status === 1 // true if the transaction was successful
  }
}

export default MockERC20
