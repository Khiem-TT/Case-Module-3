const qs = require('qs');
const url = require("url");

const BaseController = require('./base.controller');
const GeneralController = require('./../controllers/general.controller');
const ProductController = require('./../controllers/product.controller');
const productModel = require('./../models/product.model');

class HomeController {
    static async handlerHomePage(req, res) {
        if (req.method === "GET") {
            let getAllProducts = productModel.getAllProduct();
            await ProductController.getBasePage(req, res, getAllProducts, '?page=', './src/views/General/Home.html')
        } else {
            let searchValue = await GeneralController.getDataByForm(req, res);
            let getSearchProduct = productModel.getSearchProduct(searchValue.search);
            await ProductController.getBasePage(req, res, getSearchProduct, '?page=', './src/views/General/Home.html');
        }
    }

    static async handlerFilterHomePage(req, res) {
        let query = qs.parse(url.parse(req.url).query);
        if (query.type && req.method === 'GET') {
            let type = qs.parse(url.parse(req.url).query).type;
            let getProductFilterByType = productModel.getProductByType(type);
            await ProductController.getBasePage(req, res, getProductFilterByType, `filter?type=${type}&page=`, './src/views/General/Home.html');
        } else if (query.minprice && req.method === 'GET') {
            let minPrice = qs.parse(url.parse(req.url).query).minprice;
            let maxPrice = qs.parse(url.parse(req.url).query).maxprice;
            let getProductFilterByPrice = productModel.getProductByPrice(minPrice, maxPrice);
            await ProductController.getBasePage(req, res, getProductFilterByPrice, `filter?minprice=${minPrice}&maxprice=${maxPrice}&page=`, './src/views/General/Home.html');
        } else if (query.minsize && req.method === 'GET') {
            let minSize = qs.parse(url.parse(req.url).query).minsize;
            let maxSize = qs.parse(url.parse(req.url).query).maxsize;
            let getProductFilterBySize = productModel.getProductBySize(minSize, maxSize);
            await ProductController.getBasePage(req, res, getProductFilterBySize, `filter?minsize=${minSize}&maxsize=${maxSize}&page=`, './src/views/General/Home.html');
        }
    }
}

module.exports = HomeController;