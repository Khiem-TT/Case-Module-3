const BaseModel = require("./base.model");
const qs = require('qs');

class GeneralModel extends BaseModel {
    async checkExistsAccount(username, email) {
        let sql = `SELECT * FROM Account WHERE username = '${username}' OR email = '${email}'`;
        const result = await this.querySql(sql);
        return result.length > 0;
    }

    async login(username, password) {
        let sql = `CALL getAccountInfo('${username}', '${password}')`;
        const result = await this.querySql(sql);
        if (result[0].length > 0) {
            return {
                role: result[0][0].role,
                name: result[0][0].name,
                username: result[0][0].username,
                userID: result[0][0].userID
            };
        } else return result[0].length;
    }

    async registerAccount(username, password, name, phone, email, address) {
        let sql = `CALL createAccount('${username}', '${password}', '${name}', '${phone}', '${email}', '${address}')`;
        return await this.querySql(sql);
    }
}

module.exports = new GeneralModel();