// // main.ts
// import { ethers } from 'ethers'
// import dotenv from 'dotenv'
// // const { ethers } = require('ethers')
// // const dotenv = require("dotenv")

// import mongoose, { ConnectOptions } from 'mongoose'
// import { saveUser } from './userService' // Import the saveUser function

// const mongoose = require('mongoose')
// const { saveUser } = require('./userService') // Import the saveUser function
// const ConnectOptions = mongoose.ConnectionOptions // Access ConnectOptions



import { ethers } from 'ethers'
import dotenv from 'dotenv'
import mongoose, { ConnectOptions } from 'mongoose'
// import { createLiquidityPosition, removeLiquidity, saveUser } from './userService'
import {
  testCreateUser,
  testCreateLiquidityPosition, testRemoveLiquidity, testCreateOrder, testMatchOrder,
  testRepScoreMinted,
  testDxtrStaked,
  testDxtrUnStaked
} from './testingScript'

import { orderBookAbi } from "./abis.js"

dotenv.config()

async function main() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI as string, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // } as typeof ConnectOptions)
  } as ConnectOptions)


  //   // Set up provider
  const provider = new ethers.WebSocketProvider(process.env.RPC_URL)


  //   // Contract address
  //   const contractAddress = process.env.CONTRACT_ADDRESS || ""
  //   console.log("🚀 ~ process.env.CONTRACT_ADDRESS:", contractAddress)

  //   // Create contract instance
  const contract = new ethers.Contract("0x59b670e9fA9D0A427751Af201D676719a970857b", orderBookAbi, provider)

  contract.on("Orderbook__OrderPlaced", (...params) => {
    console.log("params Orderbook__OrderPlaced", params)
  })

  contract.on("Orderbook__OrderMatched", (...params) => {
    console.log("params Orderbook__OrderMatched", params)
  })

  //   console.log('Starting listener.....')

  //   // Listen for the UserRegistered event
  //   //@ts-ignore
  //   contract.on("UserRegistered", (user: string) => {
  //     console.log(`User registered: ${user}`)
  //     saveUser(user) // Call the save function
  //   })

  //   // Keep the script running
  //   console.log(`Listening for UserRegistered events on ${contractAddress}...`)

  //TESTING

  // testCreateUser()
  // testCreateLiquidityPosition()
  // testRemoveLiquidity()
  // testCreateOrder()
  // testMatchOrder()
  // testRepScoreMinted()
  // testDxtrStaked()
  // testDxtrUnStaked()


}

main().catch(console.error)
