const BaseModel = require("./base.model");

class UserModel extends BaseModel {
    async getAllUser() {
        let sql = `SELECT * FROM Account WHERE role = 0 order by username`;
        return await this.querySql(sql);
    }

    async getInfoUserByID(userID) {
        let sql = `SELECT * FROM Account WHERE userID = ${userID}`;
        return await this.querySql(sql);
    }

    async updateUser(userID, password, name, phone, email, address) {
        let sql = `CALL updateUser(${userID}, '${password}', ${name}, '${phone}', ${email}, ${address})`;
        await this.querySql(sql);
    }

    async deleteUserByID(userID) {
        let sql = `DELETE FROM Account WHERE userID = ${userID};`;
        await this.querySql(sql);
    }
}

module.exports = new UserModel();