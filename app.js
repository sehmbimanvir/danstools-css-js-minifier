const request = require('request'),
    cheerio = require('cheerio'),
    vkb = require('vkbeautify'),
    fs = require('fs'),
    path = require('path');

var app = function () {
    var file = process.argv[2];
    var fullPath = path.join(__dirname, file)

    fs.readFile(fullPath, {encoding: 'utf-8'}, (err, data) => {
        if (err) {
            console.log(err.message);
            return false;
        }
        var fileObj = getFileDetails(file);
        if (!isValidExtension(fileObj.extension)) {
            console.log('Invalid File');
            return false;
        }
        var newFileName = getNewFileName(fileObj);
        var newFilePromise = fileObj.extension === 'css' ? processCSS(data) : processJS(data);
        newFilePromise.then(response => {
            saveFile(newFileName, response);
        });
    })
}

exports.run = app;


function  processCSS (data) {
    return new Promise(resolve => {
        resolve(vkb.cssmin(data, ''));
    })
}

function processJS (data) {
    var postData = "string="+ encodeURIComponent(data) +"&action=Minify";
    return new Promise(resolve => {
        request.post({
            url: 'https://www.cleancss.com/javascript-minify/',
            body: postData,
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, (err, response, body) => {
            if (err) {
                console.log(err.message);
                return false;
            }
            var $ = cheerio.load(body);
            resolve($("textarea#string").text());
        });
    })
}

function saveFile (filename, data) {
    fs.writeFile(path.join(__dirname, filename), data, function (err) {
        if (!err) {
            console.log('File Saved Successfully');
        }
    })
}

function getFileDetails (file) {
    var data = file.split('.');
    return {
        name: data[0],
        extension: data.pop()
    }
}

function getNewFileName (file) {
    return `${file.name}.min.${file.extension}`;
}


function isValidExtension (extension) {
    var allowedExtensions = ['css', 'js'];
    return allowedExtensions.findIndex(item => item === extension) >= 0;
}