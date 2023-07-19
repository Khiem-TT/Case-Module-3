const qs = require("qs");
const url = require("url");
const fs = require('fs');

const BaseController = require('./base.controller');
const generalModel = require('./../models/general.model');
const productModel = require('./../models/product.model');
const userModel = require('./../models/user.model');
const GeneralController = require("./general.controller");
const { log } = require("console");


class AdminController {
    static async handlerAdmin(req, res) {
        try {
            if (req.method === "GET") {
                let data = await GeneralController.readJSONfile(req, res);
                let html = await BaseController.readFileData('./src/views/Admin/AdminHomePage.html');
                html = html.replace('{adminName1}', data.username);
                html = html.replace('{adminName2}', data.username);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(html);
                res.end();
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    static async handlerProductByAdmin(req, res) {
        try {
            if (req.method === "GET") {
                let data = await GeneralController.readJSONfile(req, res);
                let products = await productModel.getAllProduct();
                let newHtml = '';
                products.forEach((product) => {
                    newHtml += `<tr id='product-${product.pID}'>`;
                    newHtml += `<td>${product.pID}</td>`;
                    newHtml += `<td>${product.pName}</td>`;
                    newHtml += `<td>${parseInt(product.pPrice).toLocaleString()}</td>`;
                    newHtml += `<td>${product.pQuantity}</td>`;
                    newHtml += `<td>${product.pSize}</td>`;
                    newHtml += `<td>
                    <a href='/admin/productManager/updateProduct?id=${product.pID}'><button type="button" class="btn btn-primary"><i class="bi bi-pencil-square"></i></button></a>
                    <button name="pID" value = ${product.pID} class="btn btn-danger delete-btn-product"><i class="bi bi-trash"></i></button>
                    </td>`;
                    newHtml += `</tr>`
                })
                let html = await BaseController.readFileData('./src/views/admin/productManager.html');
                html = html.replace('{adminName1}', data.username);
                html = html.replace('{adminName2}', data.username);
                html = html.replace('{product-data}', newHtml);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(html);
                res.end();
            } else {
                await AdminController.deleteProduct(req, res);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    static async updateProductByID(req, res) {
        let id = qs.parse(url.parse(req.url).query).id;
        if (id && req.method === "GET") {
            let data = await GeneralController.readJSONfile(req, res);
            let productDataArray = await productModel.getInfoProductByID(id);
            let productInfo = productDataArray[0][0];
            let html = await BaseController.readFileData('./src/views/admin/updateProduct.html');
            html = html.replace('{adminName1}', data.username);
            html = html.replace('{adminName2}', data.username);
            html = html.replace('{pImg}', `<img src="${productInfo.pImg}" alt="Profile" class="rounded-circle"></img>`);
            html = html.replace('{productName1}', `${productInfo.pName}`);
            html = html.replace('{productDescribe}', `${productInfo.pdesc}`);
            html = html.replace('{productID}', `${productInfo.pID}`);
            html = html.replace('{productName2}', `${productInfo.pName}`);
            html = html.replace('{productType}', `${productInfo.pCode}`);
            html = html.replace('{productPrice}', `${parseInt(productInfo.pPrice).toLocaleString()}`);
            html = html.replace('{productQuantity}', `${productInfo.pQuantity}`);
            html = html.replace('{productSize}', `${productInfo.pSize} cm`);
            html = html.replace('{productNameUpdate}', `<input name="pName" type="text" class="form-control" id="pName" value="${productInfo.pName}">`);
            html = html.replace('{producTypeUpdate}', `<option selected value="${productInfo.pCode}">${productInfo.typeName}</option>`);
            html = html.replace('{productDescribeUpdate}', `${productInfo.pdesc}`);
            html = html.replace('{productPriceUpdate}', `<input name="pPrice" type="text" class="form-control" id="pPrice"value="${productInfo.pPrice}">`);
            html = html.replace('{productQtyUpdate}', `<input name="pQuantity" type="number" class="form-control" id="pQuantity" value="${productInfo.pQuantity}">`);
            html = html.replace('{productSizeUpdate}', `<input name="pSize" type="text" class="form-control" id="pSize" value="${productInfo.pSize}">`);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        } else if (req.method === "POST") {
            try {
                let data = await GeneralController.getDataByForm(req, res);
                let {pImg, pName, pCode, pDesc, pPrice, pQuantity, pSize} = data;
                if (pImg === '') {
                    await productModel.getProductImgByID(id).then(data => pImg = data[0].pImg);
                } else {
                    pImg = '/assets/img/productImage/' + pImg;
                }
                await productModel.updateProduct(id, pName, pCode, pDesc, pPrice, pQuantity, pSize, pImg);
                res.writeHead(301, {location: `/admin/productManager/updateProduct?id=${id}`});
                res.end();
            } catch (err) {
                console.log(err.message);
            }
        } else {
            res.writeHead(301, {location: '/login'});
            res.end();
        }
    }

    static async deleteProduct(req, res) {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', async () => {
            data = JSON.parse(data);
            let productID = data.pID;
            await productModel.deleteProductByID(+productID);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: true}));
        })
    }

    static async addProduct(req, res) {
        if (req.method === "GET") {
            let data = await GeneralController.readJSONfile(req, res);
            let html = await BaseController.readFileData('./src/views/Admin/addProduct.html');
            html = html.replace('{adminName1}', data.username);
            html = html.replace('{adminName2}', data.username);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            return res.end();
        } else {
            let data = await GeneralController.getDataByForm(req, res);
            let {pName, pCode, pQuantity, pPrice, pDesc, pSize, pImg} = data;
            if (pImg === '') {
                res.writeHead(301, {location: '/admin/productManager/addProduct'});
            } else {
                pImg = '/assets/img/productImage/' + pImg;
                await productModel.addProduct(pName, +pCode, +pQuantity, +pPrice, pDesc, +pSize, pImg);
                res.writeHead(301, {location: '/admin/productManager'});
            }
            return res.end();
        }
    }

    static async handlerUserByAdmin(req, res) {
        try {
            if (req.method === "GET") {
                let data = await GeneralController.readJSONfile(req, res);
                let users = await userModel.getAllUser();
                let newHtml = '';
                users.forEach((user) => {
                    newHtml += `<tr id='user-${user.userID}'>`;
                    newHtml += `<td>${user.userID}</td>`;
                    newHtml += `<td>${user.username}</td>`;
                    newHtml += `<td>${user.name}</td>`;
                    newHtml += `<td>${user.phone}</td>`;
                    newHtml += `<td>${user.email}</td>`;
                    newHtml += `<td>${user.address}</td>`;
                    newHtml += `<td>
                    <button name="userID" value = ${user.userID} class="btn btn-danger delete-btn-user"><i class="bi bi-trash"></i></button>
                    </td>`;
                    newHtml += `</tr>`
                })
                let html = await BaseController.readFileData('./src/views/admin/userManager.html');
                html = html.replace('{adminName1}', data.username);
                html = html.replace('{adminName2}', data.username);
                html = html.replace('{user-data}', newHtml);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(html);
                res.end();
            } else {
                await AdminController.deleteUser(req, res);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    static async addUser(req, res) {
        if (req.method === "GET") {
            let data = await GeneralController.readJSONfile(req, res);
            let html = await BaseController.readFileData('./src/views/Admin/addUser.html');
            html = html.replace('{adminName1}', data.username);
            html = html.replace('{adminName2}', data.username);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            return res.end();
        } else {
            let data = await GeneralController.getDataByForm(req, res);
            let {username, password, name, email, phone, address} = data;
            let usernameExists = await generalModel.checkExistsAccount(username, email);
            if (!usernameExists) {
                await generalModel.registerAccount(username, password, name, phone, email, address);
                console.log('Register success!');
                res.writeHead(301, {location: '/admin/userManager'});
                res.end();
            } else {
                console.log('Account was exists');
                res.writeHead(301, {location: '/admin/userManager/addUser'});
                res.end();
            }
        }
    }

    static async deleteUser(req, res) {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', async () => {
            data = JSON.parse(data)
            let userID = data.userID;
            await userModel.deleteUserByID(+userID);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: true}));
        })
    }
}

module.exports = AdminController;