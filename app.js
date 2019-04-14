const request = require('request'),
    cheerio = require('cheerio'),
    vkb = require('vkbeautify'),
    fs = require('fs'),
	chalk = require('chalk'),
    path = require('path'),
	log = console.log;

const app = function () {
    var originalFileName = process.argv[2],
		originalFilePull = process.cwd() + '\\' + originalFileName;
	
    fs.readFile(originalFilePull, {encoding: 'utf-8'}, (err, data) => {
        if (err) {
            log(chalk.red(err.message));
            return false;
        }
		log(chalk.green('Processing File...'))
		var originalFileSize = getFileSizeInKb(fs.statSync(originalFilePull).size);
        var fileObj = getFileDetails(originalFileName);
        if (!isValidExtension(fileObj.extension)) {
            log(chalk.red('File Doesn\'t Supported'));
            return false;
        }
        var newFileName = getNewFileName(fileObj);
        var newFilePromise = fileObj.extension === 'css' ? processCSS(data) : processJS(data);
        newFilePromise.then(response => {
            saveFile(newFileName, response).then(output => {
				var newFileSize = getFileSizeInKb(output.size);
				log(chalk.green(`File Size Reduced From ${chalk.red.bold(originalFileSize + 'Kb')} To ${chalk.red.yellow(newFileSize + 'Kb')} (Saved as ${newFileName})`));
			});
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
                log(err.message);
                return false;
            }
            var $ = cheerio.load(body);
            resolve($("textarea#string").text());
        });
    })
}

function saveFile (filename, data) {
	var finalPath = process.cwd() + '\\' + filename;
    return new Promise(resolve => {
		fs.writeFile(filename, data, function (err) {
			if (!err) {
				resolve(fs.statSync(finalPath));
			}
		})
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

function getFileSizeInKb(size) {
	return round(size / 1024);
}

function round(number) {
	return Math.round(number * 100) / 100;
}