// userService.ts
import { ILiquidityPosition, ILiquidityToken, User, LiquidityPosition, Order } from './models'

const saveUser = async (userAddress: string): Promise<void> => {
  try {
    const user = new User({ address: userAddress })
    await user.save()
    console.log(`User saved: ${userAddress}`)
  } catch (error: any) {
    console.log("🚀 ~ saveUser ~ error:", error)
    console.error(`Error saving user: ${error.message}`)
  }
}


const createLiquidityPosition = async (
  userAddress: string,
  lpId: number,
  primaryTokenAddress: string,
  primaryTokenMinPrice: number,
  primaryTokenMaxPrice: number,
  primaryTokenAmount: number,
  tradingTokenAddress: Array<string>,
  tradingTokenMinPrice: Array<number>,
  tradingTokenMaxPrice: Array<number>
): Promise<void> => {
  try {
    // Find the user by address
    const user = await User.findOne({ address: userAddress })

    if (!user) {
      console.error(`User not found: ${userAddress}`)
      return
    }

    const tokens: Partial<ILiquidityToken>[] = [{
      contractAddress: primaryTokenAddress,
      isPrimary: true,
      minPrice: primaryTokenMinPrice,
      maxPrice: primaryTokenMaxPrice,
      availableBalance: primaryTokenAmount,
    }]

    for (let i = 0; i < tradingTokenAddress.length; i++) {
      tokens.push({
        contractAddress: tradingTokenAddress[i],
        isPrimary: false,
        minPrice: tradingTokenMinPrice[i],
        maxPrice: tradingTokenMaxPrice[i],
        availableBalance: 0,
      })
    }

    const newPosition = new LiquidityPosition({
      positionId: lpId,
      tokens: tokens,
      feeEarned: [],
      userAddress: userAddress
    })

    // Save the liquidity position to the database
    await newPosition.save()

    // Add the new position to the user's liquidity positions
    user.liquidityPositions.push(newPosition)

    // Save the updated user document
    await user.save()
    console.log(`Liquidity position created for user: ${userAddress}`)
  } catch (error: any) {
    console.error(`Error creating liquidity position: ${error.message}`)
  }
}

const removeLiquidity = async (userAddress: string, positionId: number): Promise<void> => {
  try {
    // Find the user by address
    const user = await User.findOne({ address: userAddress })

    if (!user) {
      console.error(`User not found: ${userAddress}`)
      return
    }

    // Find the index of the liquidity position with the given lpId
    const positionIndex = user.liquidityPositions.findIndex(position => position.positionId === positionId)

    if (positionIndex === -1) {
      console.error(`Liquidity position not found: lpId ${positionId}`)
      return
    }


    // Remove the liquidity position from the array
    user.liquidityPositions.splice(positionIndex, 1)

    // Remove the liquidity position from the LiquidityPosition collection
    await LiquidityPosition.deleteOne({ positionId: positionId })

    // Save the updated user document
    await user.save()
    console.log(`Liquidity position with positionId ${positionId} removed for user: ${userAddress}`)
  } catch (error: any) {
    console.error(`Error removing liquidity position: ${error.message}`)
  }
}


const createOrder = async (
  userAddress: string,
  orderId: string,
  orderType: 'LIMIT' | 'MARKET',
  tokenInAddress: string,
  tokenOutAddress: string,
  tokenOutPrice: number,
  tokenInPrice: number,
  tokenInAmount: number,
  tokenOutAmount: number
): Promise<void> => {
  try {
    // Find the user by address
    const user = await User.findOne({ address: userAddress })

    if (!user) {
      console.error(`User not found: ${userAddress}`)
      return
    }

    // Create a new order instance
    const newOrder = new Order({
      orderId: orderId,
      orderType: orderType,
      matchedLPId: "",
      tokenInAddress: tokenInAddress,
      tokenOutAddress: tokenOutAddress,
      tokenOutPrice: tokenOutPrice,
      tokenInPrice: tokenInPrice,
      tokenInAmount: tokenInAmount,
      tokenOutAmount: tokenOutAmount,
    })

    // Save the order to the Order collection
    await newOrder.save()

    // Add the new order to the user's orders array
    user.orders.push(newOrder)

    // Save the updated user document
    await user.save()
    console.log(`Order created for user: ${userAddress} with orderId: ${orderId}`)

    // Emit the LimitOrderCreated or MarketOrderCreated event in kafka

  } catch (error: any) {
    console.error(`Error creating order: ${error.message}`)
  }
}


const matchOrder = async (
  traderUserAddress: string,
  lpUserAddress: string,
  orderId: string,
  matchedLPId: number,
  tokenInAddress: string,
  tokenOutAddress: string,
  tokenInAmount: number,
  tokenOutAmount: number
): Promise<void> => {
  try {
    // Find the trader and liquidity provider users by their addresses
    const traderUser = await User.findOne({ address: traderUserAddress })
    const lpUser = await User.findOne({ address: lpUserAddress })

    if (!traderUser) {
      console.error(`Trader user not found: ${traderUserAddress}`)
      return
    }

    if (!lpUser) {
      console.error(`Liquidity provider user not found: ${lpUserAddress}`)
      return
    }

    // Find the order by orderId
    const orderToMatch = await Order.findOne({ orderId: orderId })

    if (!orderToMatch) {
      console.error(`Order not found for: ${orderId}`)
      return
    }

    // Create an updated order object
    const updatedOrder = {
      orderId: orderToMatch.orderId,
      orderType: orderToMatch.orderType,
      matchedLPId: matchedLPId,
      tokenInAddress: tokenInAddress,
      tokenOutAddress: tokenOutAddress,
      tokenOutPrice: orderToMatch.tokenOutPrice,
      tokenInPrice: orderToMatch.tokenInPrice,
      tokenInAmount: tokenInAmount,
      tokenOutAmount: tokenOutAmount,
    }

    // Update the trader's order
    await Order.updateOne(
      { orderId: orderId },
      { $set: updatedOrder }
    )

    // Update the trader's order field
    const orderIndex = traderUser.orders.findIndex(order => order.orderId === orderId)
    if (orderIndex !== -1) {
      traderUser.orders[orderIndex] = updatedOrder // Update the order directly
      await traderUser.save() // Save the updated trader user
    }

    // Update the liquidity provider's order field (if necessary)
    const lpOrderIndex = lpUser.orders.findIndex(order => order.orderId === orderId)
    if (lpOrderIndex !== -1) {
      lpUser.orders[lpOrderIndex] = updatedOrder // Update the order directly
      await lpUser.save() // Save the updated liquidity provider user
    }

    console.log(`Order ${orderId} matched for trader: ${traderUserAddress} with LP: ${lpUserAddress}`)
  } catch (error: any) {
    console.error(`Error matching order: ${error.message}`)
  }
}

const repScoreMinted = async (userAddress: string, amount: number) => {
  try {
    // Find the user by address
    const user = await User.findOne({ address: userAddress })

    if (!user) {
      console.error(`User not found: ${userAddress}`)
      return
    }

    // Update the repScore
    user.repScore += amount

    // Save the updated user document
    await user.save()
    console.log(`Reputation score updated for user: ${userAddress}. New score: ${user.repScore}`)
  } catch (error: any) {
    console.error(`Error updating repScore: ${error.message}`)
  }
}

const dxtrStaked = async (userAddress: string, amount: number) => {
  try {
    // Find the user by address
    const user = await User.findOne({ address: userAddress })

    if (!user) {
      console.error(`User not found: ${userAddress}`)
      return
    }

    // Update the stakedAmount
    user.stakedAmount += amount

    // Save the updated user document
    await user.save()
    console.log(`Staked amount updated for user: ${userAddress}. New staked amount: ${user.stakedAmount}`)
  } catch (error: any) {
    console.error(`Error updating staked amount: ${error.message}`)
  }
}

const dxtrUnstaked = async (userAddress: string, amount: number) => {
  try {
    // Find the user by address
    const user = await User.findOne({ address: userAddress })

    if (!user) {
      console.error(`User not found: ${userAddress}`)
      return
    }


    // Check if the stakedAmount is greater than the amount to deduct
    if (user.stakedAmount <= 0) {
      console.error(`Cannot stake from user ${userAddress}. Current staked amount is zero.`)
      return
    }

    if (user.stakedAmount < amount) {
      console.error(`Insufficient staked amount for user ${userAddress}. Current amount: ${user.stakedAmount}, Attempted to deduct: ${amount}`)
      return
    }

    // Update the stakedAmount
    user.stakedAmount -= amount

    // Save the updated user document
    await user.save()
    console.log(`Staked amount updated for user: ${userAddress}. New Staked amount: ${user.stakedAmount}`)
  } catch (error: any) {
    console.error(`Error updating repScore: ${error.message}`)
  }
}

export { saveUser, createLiquidityPosition, removeLiquidity, createOrder, matchOrder, repScoreMinted, dxtrStaked, dxtrUnstaked }
