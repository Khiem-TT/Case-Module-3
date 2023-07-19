const qs = require('qs');
const url = require("url");

const BaseController = require('./base.controller');
const GeneralController = require('./../controllers/general.controller');
const ProductController = require('./../controllers/product.controller');
const productModel = require('./../models/product.model');
const userModel = require('./../models/user.model');

class UserController {
    static async handlerUserHomePage(req, res) {
        if (req.method === "GET") {
            let getAllProducts = productModel.getAllProduct();
            await ProductController.getBasePage(req, res, getAllProducts, '?page=', './src/views/user/UserHomePage.html')
        } else {
            let searchValue = await GeneralController.getDataByForm(req, res);
            let getSearchProduct = productModel.getSearchProduct(searchValue.search);
            await ProductController.getBasePage(req, res, getSearchProduct, '?page=', './src/views/user/UserHomePage.html');
        }
    }

    static async handlerFilterUserHomePage(req, res) {
        let query = qs.parse(url.parse(req.url).query);
        if (query.type && req.method === 'GET') {
            let type = qs.parse(url.parse(req.url).query).type;
            let getProductFilterByType = productModel.getProductByType(type);
            await ProductController.getBasePage(req, res, getProductFilterByType, `user/filter?type=${type}&page=`, './src/views/user/UserHomePage.html');
        } else if (query.minprice && req.method === 'GET') {
            let minPrice = qs.parse(url.parse(req.url).query).minprice;
            let maxPrice = qs.parse(url.parse(req.url).query).maxprice;
            let getProductFilterByPrice = productModel.getProductByPrice(minPrice, maxPrice);
            await ProductController.getBasePage(req, res, getProductFilterByPrice, `user/filter?minprice=${minPrice}&maxprice=${maxPrice}&page=`, './src/views/user/UserHomePage.html');
        } else if (query.minsize && req.method === 'GET') {
            let minSize = qs.parse(url.parse(req.url).query).minsize;
            let maxSize = qs.parse(url.parse(req.url).query).maxsize;
            let getProductFilterBySize = productModel.getProductBySize(minSize, maxSize);
            await ProductController.getBasePage(req, res, getProductFilterBySize, `user/filter?minsize=${minSize}&maxsize=${maxSize}&page=`, './src/views/user/UserHomePage.html');
        }
    }

    static async handlerUserProfilePage(req, res) {
        let query = qs.parse(url.parse(req.url).query);
        if (query.userID && req.method === "GET") {
            let data = await GeneralController.readJSONfile(req, res);
            let infoUser = await userModel.getInfoUserByID(query.userID);
            let html = await BaseController.readFileData('./src/views/user/users-profile.html');
            html = html.replace('{Username1}', data.username);
            html = html.replace('{Username2}', data.username);
            html = html.replace('{Username3}', infoUser[0].name);
            html = html.replace('{Username4}', infoUser[0].name);
            html = html.replace('{Address}', infoUser[0].address);
            html = html.replace('{Phone}', infoUser[0].phone);
            html = html.replace('{Email}', infoUser[0].email);
            html = html.replace('{NameUpdate}', `<input name="nameUpdate" type="text" class="form-control" id="nameUpdate" value="${infoUser[0].name}">`);
            html = html.replace('{AddressUpdate}', `<input name="addressUpdate" type="text" class="form-control" id="addressUpdate" value="${infoUser[0].address}">`);
            html = html.replace('{PhoneUpdate}', `<input name="phoneUpdate" type="text" class="form-control" id="phoneUpdate" value="${infoUser[0].phone}">`);
            html = html.replace('{EmailUpdate}', `<input name="emailUpdate" type="text" class="form-control" id="emailUpdate" value="${infoUser[0].email}">`);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            await GeneralController.getNotFoundPage(req, res);
        }
    }
}

module.exports = UserController;