'use strict';

const path = require('path');

const basicConf = {
    migrations: {
        directory: path.join(__dirname, 'includes/database/migrations'),
    },
    seeds: {
        directory: path.join(__dirname, 'includes/database/seeds'),
    },
};

module.exports = {
    development: {
        ...basicConf,
        client: 'sqlite3',
        connection: {
            filename: './databases/db.sqlite3',
        },
        useNullAsDefault: true,
    },
    staging: {
        ...basicConf,
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
    production: {
        ...basicConf,
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,

        },
    },
};
