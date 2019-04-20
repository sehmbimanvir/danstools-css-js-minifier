const file = require('./lib/file.js'),
    helper = require('./lib/helpers.js')
    chalk = require('chalk'),
    task = require('./lib/task.js'),
    log = console.log; 

const app = function () {
    var files = process.argv[2];
    files = files.split(',')

    files.forEach(item => {
        var originalFilePath = `${process.cwd()}\\${item}`;
        file.open(originalFilePath, {encoding: 'utf-8'} , (err, data, meta) => {
            if (err) {
                log(chalk.red(err.message));
                return;
            }

            var originalFileSize = helper.getFileSizeInKb(meta.size);
            var fileObj = helper.getFileDetails(item);
            if (!helper.isValidExtension(fileObj.extension)) {
                log(chalk.red('File Doesn\'t Supported'));
                return;
            }
            var newFileName = helper.getNewFileName(fileObj);
            task.run(data, fileObj.extension, (err, response) => {
                if (err) {
                    log(chalk.red(err.message));
                    return;
                }
                file.save(newFileName, response, (err, meta) => {
                    if (err) {
                        log(chalk.red(err.message));
                        return;
                    }
                    var newFileSize = helper.getFileSizeInKb(meta.size);
                    log(chalk.green(`File Size Reduced From ${chalk.red.bold(originalFileSize + 'Kb')} To ${chalk.red.yellow(newFileSize + 'Kb')} (Saved as ${newFileName})`));
                });
            });
        })
    });
}
exports.run = app;