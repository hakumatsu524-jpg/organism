export type Side = 'buy' | 'sell'

export type Candle = {
  symbol: string
  price: number
  volume: number
  change24h: number
  liquidity: number
}

export type Position = {
  symbol: string
  quantity: number
  averagePrice: number
}

export type Trade = {
  tick: number
  side: Side
  symbol: string
  quantity: number
  price: number
  reason: string
}

export type OrganismState = {
  sol: number
  positions: Position[]
  survivalReserve: number
  trades: Trade[]
}
