#!/usr/bin/env node

import {CliConfig} from './interfaces';
import {Validator} from './';

const reset = '\x1b[0m';
const red = '\x1b[31m';
const green = '\x1b[32m';

// tslint:disable-next-line: no-var-requires
const config: CliConfig = require(process.cwd() + '/yaml-validator');

const validator = new Validator(config.structure);
const [, , ...args] = process.argv;
validator.validateMany(...(config.files ?? args)).then((results) => {
    results.forEach((result) => {
        // tslint:disable-next-line: no-console
        console.log(
            `${hasErrors(result.results) ? red : green}${
                hasErrors(result.results) ? '✘' : '✔'
            } ${result.name}${reset}${hasErrors(result.results) ? ':' : ''}`
        );
        // tslint:disable-next-line: no-console
        result.results.forEach((r) => {
            // tslint:disable-next-line: no-console
            console.log(`   - ${r}`);
        });
    });
});

function hasErrors(results: string[]): boolean {
    return results.length > 0;
}
