import cron from 'node-cron'
import { getAdminSigner } from './utils'
import { MockOracle, PullOracle } from './services'
import {
  CHAIN_ID,
  CHAIN_TYPE,
  MOCK_ORACLE_ADDRESS,
  PAIR_INDEXES,
  REST_ADDRESS,
  MockOracleABI,
  CHAIN_INFO,
} from './constants'
import { callContract } from './utils/callContract'
import { config } from 'dotenv'
import { ethers } from 'ethers'
config()

if (!process.env.MODE || process.env.MODE === 'TEST') {
  cron.schedule('*/20 * * * * *', async () => {
    main()
  })
} else {
  main()
}

async function main() {
  console.log('eunniong clients')
  const adminSigner = getAdminSigner()
  const oracleMock = new MockOracle(CHAIN_ID, MOCK_ORACLE_ADDRESS, adminSigner)

  const client = new PullOracle(REST_ADDRESS)

  const request = {
    pair_indexes: PAIR_INDEXES,
    chain_type: CHAIN_TYPE,
  }
  const proof = await client.getProof(request)
  const { pairId, pairPrice, pairDecimal } = await callContract(proof)

  // ETH USD -> ETH / USD
  // BND USD -> BNB / USD
  // ETH / BNB -> ETH USD / BNB USD

  const {
    pairIds1,
    pairIds2,
    bnbUsdc,
    maticUsdc,
    ethUsdc,
    maticBnb,
    ethMatic,
    ethBnb,
  } = calculateDerivedPrice(pairId, pairPrice)

  // console.log(await oracleMock.getPrice(19, 89, 1))

  await oracleMock.updatePriceValue(pairId, pairDecimal, pairPrice)
  await oracleMock.updateDerivedPrice(pairIds1, pairIds2, [
    bnbUsdc,
    maticUsdc,
    ethUsdc,
    maticBnb,
    ethMatic,
    ethBnb,
  ])

  //console.log(await oracleMock.getPrice(19, 89, 1))
  // console.log(await oracleMock.getPrice(28, 89, 1))
}

const calculateDerivedPrice = (pairId: number[], pairPrice: number[]) => {
  const btcUSD = pairPrice[0]
  const ethUSD = pairPrice[1]
  const maticUSD = pairPrice[2]
  const bnbUSDT = pairPrice[3]
  const usdcUSD = pairPrice[4]

  const bnbUsdc = BigInt(
    parseInt(((bnbUSDT / (usdcUSD * 1e10)) * 1e18).toString())
  )

  const maticUsdc = BigInt(Math.floor(maticUSD / usdcUSD) * 1e18)
  const ethUsdc = BigInt(Math.floor(ethUSD / usdcUSD) * 1e18)
  const maticBnb = BigInt(
    parseInt(((((maticUSD * 1e18) / bnbUSDT) * 1e18) / 1e18).toString())
  )
  const ethMatic = BigInt(Math.floor(ethUSD / maticUSD) * 1e18)
  const ethBnb = BigInt((Math.floor(ethUSD * 1e10) / bnbUSDT) * 1e18)

  const pairIds1 = [49, 28, 19, 28, 19, 19]
  const pairIds2 = [89, 89, 89, 49, 28, 49]

  return {
    pairIds1,
    pairIds2,
    bnbUsdc,
    maticUsdc,
    ethUsdc,
    maticBnb,
    ethMatic,
    ethBnb,
  }
}
