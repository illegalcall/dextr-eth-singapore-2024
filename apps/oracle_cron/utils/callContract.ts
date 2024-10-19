import Web3 from 'web3'
import { CHAIN_ID, CHAIN_INFO, OracleProofABI } from '../constants'

export async function callContract(response: any) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(CHAIN_INFO[CHAIN_ID].rpcUrl)
  )

  const hex = response.proof_bytes

  let proof_data: any = web3.eth.abi.decodeParameters(OracleProofABI, hex) //

  let pairId = []
  let pairPrice = []
  let pairDecimal = []
  let pairTimestamp = []

  for (let i = 0; i < proof_data[0].data.length; ++i) {
    for (
      let j = 0;
      j < proof_data[0].data[i].committee_data.committee_feed.length;
      j++
    ) {
      pairId.push(
        proof_data[0].data[i].committee_data.committee_feed[j].pair.toString(10)
      ) // pushing the pair ids requested in the output vector

      pairPrice.push(
        proof_data[0].data[i].committee_data.committee_feed[j].price.toString(
          10
        )
      ) // pushing the pair price for the corresponding ids

      pairDecimal.push(
        proof_data[0].data[i].committee_data.committee_feed[
          j
        ].decimals.toString(10)
      ) // pushing the pair decimals for the corresponding ids requested

      pairTimestamp.push(
        proof_data[0].data[i].committee_data.committee_feed[
          j
        ].timestamp.toString(10)
      ) // pushing the pair timestamp for the corresponding ids requested
    }
  }

  console.log('Pair index : ', pairId)
  console.log('Pair Price : ', pairPrice)
  console.log('Pair Decimal : ', pairDecimal)
  console.log('Pair Timestamp : ', pairTimestamp)

  return {
    pairId,
    pairPrice,
    pairDecimal,
    pairTimestamp,
  }
}
