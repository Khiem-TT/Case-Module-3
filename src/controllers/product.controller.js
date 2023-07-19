const qs = require('qs');
const url = require('url');

const BaseController = require('./base.controller');
const productModel = require('./../models/product.model');
const GeneralController = require('./general.controller');

class ProductController {
    static async getListProduct(page, func) {
        let products = await func;
        let startIndex = (parseInt(page) - 1) * 12;
        let endIndex = page * 12;
        let paginatedProducts = products.slice(startIndex, endIndex);
        let newHtml = '';
        paginatedProducts.forEach((product) => {
            newHtml += `<div class="col-md-3 mb-5">`;
            newHtml += `<div class="card h-100">`;
            newHtml += `<img class="card-img-top" src="${product.pImg}" alt="...">`;
            newHtml += `<div class="card-body p-4">`;
            newHtml += `<div class="text-center">`;
            newHtml += `<p class="fw-bolder">${product.pName}</p>`;
            newHtml += `<p class="fw-bolder">Size: ${product.pSize}cm</p>`;
            newHtml += `<p class="fw-bolder">${parseInt(product.pPrice).toLocaleString()} VNĐ</p>`;
            newHtml +=
                `</div>
                    </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <a class="btn btn-outline-dark mt-auto w-100 mb-2" href="/product?id=${product.pID}">Chi Tiết Sản Phẩm</a>
                            </div>
                            <div class="text-center">
                                <a class="btn btn-outline-dark mt-auto w-100" href="/login">Thêm Vào Giỏ Hàng</a>
                            </div>
                        </div>
                    </div>
                </div>`
        })
        let totalPages = Math.ceil(products.length / 12);
        return {
            listProducts: newHtml,
            numPage: totalPages
        }
    }

    static async getBasePage(req, res, func, link, filePath) {
        let query = qs.parse(url.parse(req.url).query);
        let products = await func;
        let html = await BaseController.readFileData(filePath);
        let htmlReplace = await ProductController.getListProduct(query.page ? query.page : 1, products);
        let newHtml = htmlReplace.listProducts;
        let totalPages = htmlReplace.numPage;
        let paginationHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<li class="page-item"></li>`;
            paginationHtml += `<a class="page-link" href="${link}${i}">${i}</a>`;
            paginationHtml += `</li>`;
        }
        html = html.replace('{list-product}', newHtml);
        html = html.replace('{pagin}', paginationHtml);
        if (filePath === './src/views/user/UserHomePage.html') {
            let dataUser = await GeneralController.readJSONfile(req, res);
            html = html.replace('{Username1}', dataUser.username);
            html = html.replace('{Username2}', dataUser.username);
            html = html.replace('{user-info}', `<a class="dropdown-item d-flex align-items-center" href="/user/profile?userID=${dataUser.userID}">
            <i class="bi bi-person"></i>
            <span>Thông tin người dùng</span></a>`);
        }
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(html);
        res.end();
    }

    static async getDetailProduct(req, res) {
        let id = qs.parse(url.parse(req.url).query).id;
        if (id && req.method === "GET") {
            let productDataArray = await productModel.getInfoProductByID(id);
            let productInfo = productDataArray[0][0];
            let html = await BaseController.readFileData('./src/views/general/Product.html');
            html = html.replace('{pImg}', `<img src="${productInfo.pImg}" alt="Profile" class="rounded-circle"></img>`);
            html = html.replace('{productName1}', `${productInfo.pName}`);
            html = html.replace('{productDescribe}', `${productInfo.pdesc}`);
            html = html.replace('{productID}', `${productInfo.pID}`);
            html = html.replace('{productName2}', `${productInfo.pName}`);
            html = html.replace('{productType}', `${productInfo.pCode}`);
            html = html.replace('{productPrice}', `${parseInt(productInfo.pPrice).toLocaleString()}`);
            html = html.replace('{productQuantity}', `${productInfo.pQuantity}`);
            html = html.replace('{productSize}', `${productInfo.pSize} cm`);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            res.writeHead(301, {location: '/'});
            res.end();
        }
    }
}

module.exports = ProductController;