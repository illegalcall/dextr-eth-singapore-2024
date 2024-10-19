// import { Kafka } from 'kafkajs'
// import { MongoClient } from 'mongodb'
// import dotenv from 'dotenv'

// dotenv.config()

// const kafka = new Kafka({
//   clientId: 'execution_service',
//   brokers: [process.env.KAFKA_BROKER as string],
// })

// const mongoClient = new MongoClient(process.env.MONGODB_URI as string)

// async function run() {
//   // Connect to MongoDB
//   await mongoClient.connect()
//   const db = mongoClient.db()
//   const collection = db.collection('liquidity_positions') // Change to your collection name

//   const consumer = kafka.consumer({ groupId: 'execution_group' })

//   await consumer.connect()
//   await consumer.subscribe({ topic: 'market-order-create', fromBeginning: true }) // Subscribe to the topic

//   // Publish a sample message to the topic
//   const producer = kafka.producer()
//   await producer.connect()

//   // Sample message to publish
//   const marketOrder = {
//     amountIn: 100, // Replace with actual data
//     // Add other fields as needed
//   }

//   await producer.send({
//     topic: 'market-order-create',
//     messages: [
//       {
//         key: 'order-key', // Optional key
//         value: JSON.stringify(marketOrder),
//       },
//     ],
//   })

//   console.log('Sample MarketOrderCreated message published.')

//   // Process incoming messages
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       const key = message.key?.toString()
//       const value = message.value?.toString()

//       console.log(`Received MarketOrderCreated message: ${key}: ${value}`)

//       // Parse the message (assuming it's in JSON format)
//       //@ts-ignore
//       const marketOrder = JSON.parse(value)
//       const amountIn = marketOrder.amountIn // Extract amountIn from the event
//       const rate = 1.5 // Hardcoded rate for calculation

//       // Calculate amount out
//       const amountOut = amountIn * rate

//       // Fetch liquidity positions
//       const liquidityPositions = await collection.find({}).toArray()

//       // Filter liquidity positions based on conditions
//       const filteredPositions = liquidityPositions.filter(position => {
//         const { balance, minPrice, maxPrice } = position

//         return (
//           amountOut <= balance && // Condition a
//           minPrice <= amountOut && amountOut <= maxPrice // Condition b
//         )
//       })

//       // Log the filtered documents
//       console.log('Filtered Liquidity Positions:', filteredPositions)
//     },
//   })

//   console.log('Kafka consumer started and listening for MarketOrderCreated messages...')
// }

// run().catch(console.error).finally(() => mongoClient.close())

import { Kafka } from 'kafkajs'
import { MongoClient } from 'mongodb'

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
})

// MongoDB setup
const mongoUrl = 'mongodb://localhost:27017' // Adjust as necessary
const dbName = 'dexdb'
const client = new MongoClient(mongoUrl)
let db: any

// Producer setup
const producer = kafka.producer()

// Consumer setup
const consumer = kafka.consumer({ groupId: 'test-group' })

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await client.connect()
    db = client.db(dbName)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB', error)
    process.exit(1)
  }
}

const runProducer = async () => {
  await producer.connect()
  console.log('Producer connected')

  setInterval(async () => {
    // const message = {
    //   value: `Hello Kafka! ${new Date().toISOString()}`,
    // }

    // Sample message to publish
    const marketOrder = {
      value: JSON.stringify({
        tokenInAddress: '0xusdcaddress', // Replace with actual data
        tokenInPrice: 1,
        tokenInAmount: 1000,
        tokenOutAddress: '0xethaddress',
        // tokenOutAmount // to be calculated
      })
    }
    await producer.send({
      topic: 'test-topic',
      // messages: [message],
      messages: [marketOrder],
    })
    console.log('Message sent:', marketOrder)
  }, 10000)
}

const runConsumer = async () => {
  await consumer.connect()
  console.log('Consumer connected')

  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = message.value?.toString()
      console.log(`Received message: ${msgValue}`)

      // Insert the message into MongoDB
      if (db) {
        try {

          //@ts-ignore
          const marketOrder = JSON.parse(msgValue)
          const tokenInAmount = marketOrder.tokenInAmount // Extract amountIn from the event
          const currentMarketPrice = 3000 // ETH/USDC
          const tokenOutAmount = tokenInAmount / currentMarketPrice

          // Calculate amount out
          // const totalPrice = tokenInAmount * currentMarketPrice

          // Fetch liquidity positions
          const liquidityPositions = await db.collection('liquiditypositions').find({}).toArray()
          console.log("🚀 ~ eachMessage: ~ liquidityPositions:", liquidityPositions)

          // Filter liquidity positions based on conditions
          const filteredPositions = liquidityPositions.filter((position: any) => {
            return position.tokens.filter((token: any) => {
              console.log("🚀 ~ position.tokens.filter ~ token:", token)

              const { availableBalance, minPrice, maxPrice } = token

              return (
                (tokenOutAmount <= availableBalance) // Condition a
                && (minPrice <= currentMarketPrice && currentMarketPrice <= maxPrice) // Condition b
              )
            }).length > 0
          })

          // Log the filtered documents
          console.log('Filtered Liquidity Positions:', JSON.stringify(filteredPositions))

          // Fetch users based on the positionIds from filtered positions
          const filteredUserAddress = filteredPositions.map((position: any) => position.userAddress)
          console.log("🚀 ~ eachMessage: ~ positionIds:", filteredUserAddress)

          const filteredUsers = await db.collection('users').find({
            address: { $in: filteredUserAddress }
          }).toArray()
          console.log("🚀 ~ filteredUsers ~ filteredUsers:", filteredUsers)



          // Create a mapping of positionId to user repScores
          const userRepScores: Record<number, number> = {}
          filteredUsers.forEach((user: any) => {
            userRepScores[user.address] = user.repScore
          })
          console.log("🚀 ~ eachMessage: ~ userRepScores:", userRepScores)

          // Sort filteredPositions based on user repScore
          const sortedPositions = filteredPositions.sort((a: any, b: any) => {
            const aRepScore = userRepScores[a.userAddress] || 0 // Default to 0 if not found
            const bRepScore = userRepScores[b.userAddress] || 0 // Default to 0 if not found
            return bRepScore - aRepScore // Sort in descending order
          })

          // Log the sorted positions
          console.log('Sorted Liquidity Positions by User Rep Score:', JSON.stringify(sortedPositions))



          // await db.collection('messages').insertOne({ message: msgValue, receivedAt: new Date() })
          console.log('Message inserted into MongoDB:', msgValue)
          return
        } catch (error) {
          console.error('Failed to insert message into MongoDB', error)
        }
      }
    },
  })
}

// Run both producer and consumer
const run = async () => {
  await connectToMongoDB() // Connect to MongoDB first
  await Promise.all([runProducer(), runConsumer()])
}

run().catch(console.error)
