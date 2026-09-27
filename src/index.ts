import { printReport, runSimulation } from './simulator.js'

const ticksFlag = process.argv.indexOf('--ticks')
const ticks = ticksFlag >= 0 ? Number(process.argv[ticksFlag + 1]) : 12

if (!Number.isInteger(ticks) || ticks < 1 || ticks > 10_000) {
  console.error('Usage: organism --ticks <positive integer up to 10000>')
  process.exit(1)
}

printReport(runSimulation(ticks))
