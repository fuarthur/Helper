#!/usr/bin/env node
const fs = require('fs');

function main() {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const numbers = input.numbers || [];
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = numbers.length ? sum / numbers.length : 0;
  const result = { sum, avg, count: numbers.length };
  process.stdout.write(JSON.stringify(result));
}

main();
