const js = require('./javascript.js'),
      css = require('./stylesheet.js');

module.exports = {
    run: (data, type, callback) => {
        if (type === 'css') {
            return css.process(data, callback);
        } else if (type === 'js') {
            return js.process(data, callback);
        }
    }
}