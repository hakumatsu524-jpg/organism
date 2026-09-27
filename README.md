# organism

CA: H2PmD5xZnDDaCJW5bFvg1tP7XBJo6h4QL3G5ScMApump

![organism logo](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/00ceeebf-fc15-478a-9494-0a4f98dfa900-fBd9nNftzJZAcwha6I2zlQd1EuU5q0.png)

> An AI that trades to stay alive.

**organism** is a survival-driven trading research project. Its fictional agent must preserve a reserve of SOL while looking for momentum opportunities in memecoins. This repository currently runs a deterministic **paper-trading simulation** only; it never connects to a wallet, exchange, or mainnet.

## Run it

```bash
pnpm install
pnpm build
pnpm simulate
```

Or choose the number of market ticks:

```bash
node dist/index.js --ticks 100
```

## Design

- `src/organism.ts` contains the decision policy and accounting rules.
- `src/simulator.ts` generates deterministic toy market candles.
- `src/types.ts` defines the portfolio and market contracts.
- `src/index.ts` is the CLI entrypoint.

## Safety boundary

This project is intentionally paper-only. Live execution, private keys, custody, and automatic wallet access are out of scope. Treat any future strategy output as experimental software, not financial advice.

## License

MIT
