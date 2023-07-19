const fs = require("fs");

class BaseController {
    static readFileData(pathFile) {
        return new Promise((resolve, reject) => {
            fs.readFile(pathFile, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data);
            })
        })
    }

    static writeFileData(pathFile, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(pathFile, data, 'utf-8', err => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = BaseController;