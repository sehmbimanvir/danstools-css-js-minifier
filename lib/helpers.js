const settings = require('./settings.js')

const Helper = {
    getFileDetails: (file) => {
        var data = file.split('.');
        return { name: data[0], extension: data.pop() }
    },

    getNewFileName: (file) => {
        return `${file.name}.min.${file.extension}`;
    },

    isValidExtension: (extension) => {
        return settings.ALLOWED_EXTENSIONS.findIndex(item => item === extension) >= 0;    
    },

    getFileSizeInKb: (size) => {
	    return Helper.round(size / 1024);
    },

    round: (number) => {
        return Math.round(number * 100) / 100;
    }
}

module.exports = Helper;