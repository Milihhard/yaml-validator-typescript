#!/usr/bin/env node
const [a, b, ...args] = process.argv;
// tslint:disable-next-line: no-console
console.log(`a: ${a}`);
// tslint:disable-next-line: no-console
console.log(`b: ${b}`);
// tslint:disable-next-line: no-console
console.log(`args: ${args}`);

// export const cli = 'cli';
