'use strict';

const fs = require('fs-extra');
const request = require('request');

module.exports = {
    toCamel: str =>
        str.toLowerCase().replace(/[-_: ]/g, ' ')
            .split(' ').filter(x => !!x)
            .map(word => {
                return word[0].toUpperCase() + word.substr(1);
            })
            .join(''),
    urlToFile: async (url, filename) => new Promise((resolve, reject) => {
        request({
            url,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'accept-language': 'en-US,en;q=0.9,es;q=0.8,jw;q=0.7',
                'cache-control': 'max-age=0',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
            },
        }).pipe(fs.createWriteStream(filename))
            .on('error', reject)
            .on('finish', resolve);
    }),
};
