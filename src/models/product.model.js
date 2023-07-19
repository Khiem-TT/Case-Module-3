const BaseModel = require("./base.model");

class ProductModel extends BaseModel {
    async getAllProduct() {
        let sql = `SELECT * FROM product order by pPrice`;
        return await this.querySql(sql);
    }

    async getSearchProduct(searchValue) {
        let sql = `SELECT * FROM product WHERE pName like '%${searchValue}%' order by pPrice`;
        return await this.querySql(sql);
    }

    async getProductByType(type) {
        let sql = `SELECT * FROM product WHERE pCode = ${parseInt(type)} order by pPrice`;
        return await this.querySql(sql);
    }

    async getProductByPrice(minPrice, maxPrice) {
        let sql = `SELECT * FROM product WHERE pPrice BETWEEN ${parseInt(minPrice)} AND ${parseInt(maxPrice)} order by pPrice`;
        return await this.querySql(sql);
    }

    async getProductBySize(minSize, maxSize) {
        let sql = `SELECT * FROM product WHERE pSize BETWEEN ${parseInt(minSize)} AND ${parseInt(maxSize)} order by pPrice`;
        return await this.querySql(sql);
    }

    async getInfoProductByID(pID) {
        let sql = `CALL getProductByID(${pID})`;
        return await this.querySql(sql);
    }

    async updateProduct(pID, pName, pCode, pDesc, pPrice, pQuantity, pSize, pImg) {
        let sql = `CALL updateProduct(${pID}, '${pName}', ${parseInt(pCode)}, '${pDesc}', ${parseFloat(pPrice)}, ${parseInt(pQuantity)}, ${parseInt(pSize)}, '${pImg}')`;
        await this.querySql(sql);
    }
    async getProductImgByID(pID) {
        let sql = `SELECT pImg FROM Product WHERE pID = ${pID};`;
        return await this.querySql(sql);
    }

    async deleteProductByID(pID) {
        let sql = `DELETE FROM Product WHERE pID = ${pID};`;
        await this.querySql(sql);
    }

    async addProduct(pName, pCode, pQuantity, pPrice, pdesc, pSize, pImg) {
        let sql = `insert into Product (pName, pCode, pQuantity, pPrice, pdesc, pSize, pImg) values ('${pName}', '${pCode}', '${pQuantity}', '${pPrice}', '${pdesc}', '${pSize}', '${pImg}');`;
        await this.querySql(sql);
    }
}

module.exports = new ProductModel();