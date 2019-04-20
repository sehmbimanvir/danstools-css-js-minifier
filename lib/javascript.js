const request = require('request'),
      cheerio = require('cheerio'),
      settings = require('./settings.js')

module.exports = {
    process: (data, callback) => {
        return request.post({
            url: settings.JS_MINIFY_URL,
            form: {string: data, action: 'Minify'},
            headers: settings.HEADERS,
        }, (err, response, body) => {
            if (err) return callback(err);
            var $ = cheerio.load(body);
            callback(null, $(settings.ELEMENT).text())
        });
    }
}