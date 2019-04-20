const fs = require('fs');

module.exports = {
    open: (filename, options = {}, callback) => {
        return fs.readFile(filename, options, (err, content) => {
            if (err) {
                return callback(err)
            };
            callback(null, content, fs.statSync(filename));
        });
    },

    save: (filename, data, callback) => {
        return fs.writeFile(filename, data, (err, data) => {
            if (err) {
                return callback(err)
            };
            callback(null, fs.statSync(filename));
        })
    }
}