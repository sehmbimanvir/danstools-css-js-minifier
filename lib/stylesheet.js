const vkb = require('vkbeautify');

module.exports = {
    process: (data, callback) => {
        callback(null, vkb.cssmin(data, ''));
    }
}