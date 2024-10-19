// listens to kafka topic MarketOrderCreated event


// calculate amount out based on amount in and rate(hardcoded for now)
// filter liquiditypositions based on the below conditions
// a. the amount out token is <= any of the tokens .balance
// b. the outToken's minPrice and maxPrice falls between each