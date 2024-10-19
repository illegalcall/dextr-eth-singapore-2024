ILiquidityToken {
  contractAddress
  isPrimary
  minPrice
  maxPrice
  availableBalance
}

IFeeEarned{
  tokenAddress
  feeAmount
}

IUser{
  address
  liquidityPositions: ILiquidityPosition[]
  repScore: uint
  orders: IOrder[]
  stakedAmount: uint
}

ILiquidityPosition{
  positionId
  tokens: ILiquidityToken[]
  feeEarned: IFeeEarned[]

}

IOrder{
  orderId
  orderType: enum LIMIT, MARKET
  matchedLPId
  tokenInAddress // token send to pool
  tokenOutAdress // token taken out of pool
  tokenOutPrice
  tokenInPrice
  tokenInAmount
  tokenOutAmount
}


