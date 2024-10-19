import {
  CHAIN_ID,
  CHAIN_INFO,
  MOCK_ORACLE_ADDRESS,
  MockOracleABI,
} from '../constants'
import { OracleClientMock, OracleClientMock__factory } from '../types'
import { ethers, Signer } from 'ethers'
import { getAdminSigner } from '../utils'

export class MockOracle {
  chainId: string
  contract: OracleClientMock
  signer: Signer

  constructor(chainId: string, address: string, signer: Signer) {
    this.chainId = chainId
    this.contract = OracleClientMock__factory.connect(address, signer)
    this.signer = signer
  }

  async getPrice(pair1: number, pair2: number, operation: number) {
    return this.contract.getAllPricesForPair(pair1, pair2, operation)
  }

  async updatePriceValue(
    pairs: number[],
    decimals: number[],
    prices: number[]
  ) {
    const tx = await this.contract.updatePricePairValues(
      pairs,
      decimals,
      prices
    )

    await tx.wait()
  }

  async updateDerivedPrice(
    pairId1: number[],
    pairId2: number[],
    prices: any[]
  ) {
    const tx = await this.contract.updateDerivedPricePairValues(
      pairId1,
      pairId2,
      prices
    )
    await tx.wait()
  }

  async getDerivedPrice(pairId1: number, pairId2: number) {
    return await this.contract.getDerivedValueOfPair(pairId1, pairId2, 1)
  }
}
