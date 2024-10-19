import { createLiquidityPosition, createOrder, matchOrder, removeLiquidity, repScoreMinted, saveUser, dxtrStaked, dxtrUnstaked } from './userService'


// same for dxtrStaked, dxtrUnstaked, 

const USER_ID = "userId"
const TRADER_USER_ID = "traderUserId"
const LP_USER_ID = "lpUserId"


const testCreateUser = async () => {
  const user = USER_ID
  const user2 = TRADER_USER_ID
  const user3 = LP_USER_ID

  // saveUser(user) // Call the save function

  // saveUser(user2) // Call the save function
  await saveUser(user3) // Call the save function


}
const testCreateLiquidityPosition = async () => {
  const userAddress = LP_USER_ID // Sample user address
  const lpId = 1 // Sample liquidity position ID
  const primaryTokenAddress = "0xethaddress" // Sample primary token address
  const primaryTokenMinPrice = 3100
  const primaryTokenMaxPrice = 3200
  const primaryTokenAmount = 2
  const tradingTokenAddress = [
    "0xsecondary1", // Sample trading token address 1
    "0xsecondary2", // Sample trading token address 2
  ]
  const tradingTokenMinPrice = [50, 75] // Sample trading token min prices
  const tradingTokenMaxPrice = [150, 175] // Sample trading token max prices

  createLiquidityPosition(
    userAddress,
    lpId,
    primaryTokenAddress,
    primaryTokenMinPrice,
    primaryTokenMaxPrice,
    primaryTokenAmount,
    tradingTokenAddress,
    tradingTokenMinPrice,
    tradingTokenMaxPrice
  )
}

const testRemoveLiquidity = () => {
  removeLiquidity(USER_ID, 1)
}

const testCreateOrder = () => {
  createOrder(
    TRADER_USER_ID,
    'orderId123',
    'LIMIT',
    'tokenInAddressHere',
    'tokenOutAddressHere',
    100, // tokenOutPrice
    95,  // tokenInPrice
    10,  // tokenInAmount
    0.1  // tokenOutAmount
  )
}

const testMatchOrder = () => {
  matchOrder(
    TRADER_USER_ID,
    LP_USER_ID,
    'orderId123',
    1, // matchedLPId
    'tokenInAddressHere',
    'tokenOutAddressHere',
    10, // tokenInAmount
    0.1 // tokenOutAmount
  )
}

const testRepScoreMinted = async () => {
  await repScoreMinted(USER_ID, 10)
}

const testDxtrStaked = async () => {
  await dxtrStaked(USER_ID, 100)
}

const testDxtrUnStaked = async () => {
  await dxtrUnstaked(USER_ID, 90)
}


export {
  testCreateUser, testCreateLiquidityPosition, testRemoveLiquidity, testCreateOrder, testMatchOrder, testRepScoreMinted, testDxtrStaked, testDxtrUnStaked
}