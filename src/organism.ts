import type { Candle, OrganismState, Trade } from './types.js'

const MIN_RESERVE = 0.05
const MAX_POSITION_SHARE = 0.2

export class Organism {
  constructor(private readonly state: OrganismState) {}

  decide(tick: number, markets: Candle[]): Trade | null {
    const candidates = markets
      .filter((market) => market.liquidity > 50_000 && market.price > 0)
      .sort((a, b) => b.change24h - a.change24h)

    const heldSymbols = new Set(this.state.positions.map((position) => position.symbol))
    const winner = candidates.find((market) => market.change24h > 2 && !heldSymbols.has(market.symbol))

    if (winner) {
      const spendable = Math.max(0, this.state.sol - this.state.survivalReserve - MIN_RESERVE)
      const allocation = Math.min(spendable, this.state.sol * MAX_POSITION_SHARE)
      if (allocation > 0) {
        return {
          tick,
          side: 'buy',
          symbol: winner.symbol,
          quantity: allocation / winner.price,
          price: winner.price,
          reason: 'momentum entry while preserving survival reserve',
        }
      }
    }

    const loser = markets.find((market) => {
      const position = this.state.positions.find((item) => item.symbol === market.symbol)
      return position && market.change24h < -5
    })

    if (loser) {
      const position = this.state.positions.find((item) => item.symbol === loser.symbol)!
      return {
        tick,
        side: 'sell',
        symbol: loser.symbol,
        quantity: position.quantity,
        price: loser.price,
        reason: 'risk exit after adverse movement',
      }
    }

    return null
  }
}

export function applyTrade(state: OrganismState, trade: Trade): void {
  const notional = trade.quantity * trade.price
  if (trade.side === 'buy') {
    if (notional > state.sol - state.survivalReserve) return
    state.sol -= notional
    const existing = state.positions.find((position) => position.symbol === trade.symbol)
    if (existing) {
      const total = existing.quantity * existing.averagePrice + notional
      existing.quantity += trade.quantity
      existing.averagePrice = total / existing.quantity
    } else {
      state.positions.push({ symbol: trade.symbol, quantity: trade.quantity, averagePrice: trade.price })
    }
  } else {
    const index = state.positions.findIndex((position) => position.symbol === trade.symbol)
    if (index === -1) return
    const position = state.positions[index]
    const quantity = Math.min(position.quantity, trade.quantity)
    state.sol += quantity * trade.price
    position.quantity -= quantity
    if (position.quantity <= 1e-12) state.positions.splice(index, 1)
  }
  state.trades.push(trade)
}
