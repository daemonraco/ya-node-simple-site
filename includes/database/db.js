'use strict';

const bookshelf = require('bookshelf');
const knex = require('knex');
const path = require('path');

const fullConf = require(path.join(__dirname, '../../knexfile.js'));
const conf = fullConf[global.envName] !== undefined ? fullConf[global.envName] : fullConf['development'];

const DB = knex(conf);
const BookShelf = bookshelf(DB);

BookShelf.plugin('pagination');
BookShelf.plugin('registry');

module.exports = {
    BookShelf,
    DB,
};
