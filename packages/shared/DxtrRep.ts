import { ethers, Provider, Signer, Contract } from 'ethers'

import abi from './abis/DxtrRepABI.json'
class DxtrRep {
  private contract: Contract
  private provider: Provider
  private signer: Signer

  constructor(provider: Provider, signer: Signer, address: string) {
    this.provider = provider
    this.signer = signer
    this.contract = new Contract(address, abi, signer)
  }

  async allowance(owner: string, spender: string): Promise<number> {
    const amount = await this.contract.allowance(owner, spender)
    return amount.toNumber()
  }

  async approve(spender: string, value: number): Promise<boolean> {
    const tx = await this.contract.approve(spender, value)
    await tx.wait()
    return true
  }

  async balanceOf(account: string): Promise<number> {
    const balance = await this.contract.balanceOf(account)
    return balance.toNumber()
  }

  async decimals(): Promise<number> {
    const decimals = await this.contract.decimals()
    return decimals
  }

  async mint(recipient: string, amount: number): Promise<void> {
    const tx = await this.contract.mint(recipient, amount)
    await tx.wait()
  }

  async name(): Promise<string> {
    return await this.contract.name()
  }

  async owner(): Promise<string> {
    return await this.contract.owner()
  }

  async renounceOwnership(): Promise<void> {
    const tx = await this.contract.renounceOwnership()
    await tx.wait()
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
    return true
  }

  async transferFrom(from: string, to: string, value: number): Promise<boolean> {
    const tx = await this.contract.transferFrom(from, to, value)
    await tx.wait()
    return true
  }

  async transferOwnership(newOwner: string): Promise<void> {
    const tx = await this.contract.transferOwnership(newOwner)
    await tx.wait()
  }
}

export default DxtrRep
