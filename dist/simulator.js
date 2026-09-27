import { Organism, applyTrade } from './organism.js';
const symbols = ['BONK', 'WIF', 'POPCAT', 'JUP'];
function marketAt(tick) {
    return symbols.map((symbol, index) => {
        const drift = Math.sin(tick * 0.8 + index) * 8 + (index === tick % symbols.length ? 7 : 0);
        return {
            symbol,
            price: 0.00001 * (index + 1) * (1 + drift / 100),
            volume: 80_000 + index * 25_000,
            change24h: drift,
            liquidity: 100_000 + index * 40_000,
        };
    });
}
export function runSimulation(ticks, startingSol = 1) {
    const state = { sol: startingSol, positions: [], survivalReserve: 0.15, trades: [] };
    const organism = new Organism(state);
    for (let tick = 1; tick <= ticks; tick += 1) {
        const markets = marketAt(tick);
        const trade = organism.decide(tick, markets);
        if (trade)
            applyTrade(state, trade);
    }
    return state;
}
export function printReport(state) {
    console.log('\nORGANISM // survival report');
    console.log(`SOL liquid: ${state.sol.toFixed(4)}`);
    console.log(`Positions: ${state.positions.length}`);
    console.log(`Trades: ${state.trades.length}`);
    for (const trade of state.trades) {
        console.log(`tick ${trade.tick}: ${trade.side.toUpperCase()} ${trade.symbol} @ ${trade.price} — ${trade.reason}`);
    }
}
