'use strict';

const chalk = require('chalk');
const glob = require('glob');
const path = require('path');

const { toCamel } = require('../tools');
const { BookShelf, DB } = require('./db');

const modelPattern = /^(.*)\/(.*)\.model.js$/;
const models = {};
console.log(`Loading model:`);
for (const p of glob.sync(path.join(__dirname, 'models/*.model.js'))) {
    const match = p.match(modelPattern);
    if (match) {
        const name = toCamel(match[2]);
        console.log(`\t- '${chalk.green(name)}'`);
        models[name] = require(p);
    }
}

module.exports = {
    BookShelf,
    DB,
    ...models,
};
