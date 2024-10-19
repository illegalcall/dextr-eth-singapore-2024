import mongoose, { Schema, Document } from 'mongoose'

// Interfaces
interface ILiquidityToken extends Document {
  contractAddress: string
  isPrimary: boolean
  minPrice: number
  maxPrice: number
  availableBalance: number
}

interface IFeeEarned extends Document {
  tokenAddress: string
  feeAmount: number
}

interface ILiquidityPosition extends Document {
  positionId: number
  tokens: Partial<ILiquidityToken>[] // Ensure this references the interface correctly
  feeEarned: IFeeEarned[]
  userAddress: string
}

interface IOrder extends Document {
  orderId: string
  orderType: 'LIMIT' | 'MARKET'
  matchedLPId: number
  tokenInAddress: string
  tokenOutAddress: string
  tokenOutPrice: number
  tokenInPrice: number
  tokenInAmount: number
  tokenOutAmount: number
}

interface IUser extends Document {
  address: string
  liquidityPositions: Partial<ILiquidityPosition>[]
  repScore: number
  orders: Partial<IOrder>[]
  stakedAmount: number
}

// Schemas
const liquidityTokenSchema = new Schema<ILiquidityToken>({
  contractAddress: { type: String, required: true },
  isPrimary: { type: Boolean, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  availableBalance: { type: Number, required: true },
})

const feeEarnedSchema = new Schema<IFeeEarned>({
  tokenAddress: { type: String, required: true },
  feeAmount: { type: Number, required: true },
})

const liquidityPositionSchema = new Schema<ILiquidityPosition>({
  positionId: { type: Number, required: true, unique: true },
  tokens: { type: [liquidityTokenSchema], required: true }, // Corrected to use Schema directly
  feeEarned: { type: [feeEarnedSchema], default: [] }, // Default to empty array
  userAddress: { type: String, required: true },
})

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  orderType: { type: String, enum: ['LIMIT', 'MARKET'], required: true },
  matchedLPId: { type: Number, required: false },
  tokenInAddress: { type: String, required: true },
  tokenOutAddress: { type: String, required: true },
  tokenOutPrice: { type: Number, required: true },
  tokenInPrice: { type: Number, required: true },
  tokenInAmount: { type: Number, required: true },
  tokenOutAmount: { type: Number, required: true },
})

// User Schema
const userSchema = new Schema<IUser>({
  address: { type: String, required: true, unique: true },
  liquidityPositions: { type: [liquidityPositionSchema], default: [] }, // Default to empty array
  repScore: { type: Number, default: 0 },
  orders: { type: [orderSchema], default: [] }, // Default to empty array
  stakedAmount: { type: Number, default: 0 },
})

// Models
const LiquidityToken = mongoose.model<ILiquidityToken>('LiquidityToken', liquidityTokenSchema)
const FeeEarned = mongoose.model<IFeeEarned>('FeeEarned', feeEarnedSchema)
const LiquidityPosition = mongoose.model<ILiquidityPosition>('LiquidityPosition', liquidityPositionSchema)
const Order = mongoose.model<IOrder>('Order', orderSchema)
const User = mongoose.model<IUser>('User', userSchema)

// Export Models
export {
  User,
  LiquidityToken,
  FeeEarned,
  LiquidityPosition,
  Order,
  IUser,
  ILiquidityToken,
  IFeeEarned,
  ILiquidityPosition,
  IOrder,
}
