const http = require('http');
const url = require('url');
const fs = require('fs');

const HomeController = require('./src/controllers/home.controller');
const GeneralController = require('./src/controllers/general.controller');
const ProductController = require('./src/controllers/product.controller');
const AdminController = require('./src/controllers/admin.controller');
const UserController = require('./src/controllers/user.controler');

const PORT = 3000;

let mimeTypes = {
    'jpeg': 'images/jpeg',
    'jpg': 'images/jpg',
    'png': 'images/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'svg': 'image/svg+xml',
    'ttf': 'font/ttf',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer(async (req, res) => {
    let urlPath = url.parse(req.url).pathname;
    const filesDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.jpeg|\.ttf|\.woff|\.woff2|\.eot/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + req.url).pipe(res)
    } else {
        let chosenHandler = (typeof (router[urlPath]) !== 'undefined') ? router[urlPath] : GeneralController.getNotFoundPage;
        chosenHandler(req, res).catch(err => {
            console.log(err.message)
        });
    }
})
router = {
    '/': HomeController.handlerHomePage,
    '/filter': HomeController.handlerFilterHomePage,
    '/login': GeneralController.handlerLoginPage,
    '/register': GeneralController.handlerRegister,
    '/admin': AdminController.handlerAdmin,
    '/admin/productManager': AdminController.handlerProductByAdmin,
    '/admin/productManager/updateProduct': AdminController.updateProductByID,
    '/admin/productManager/addProduct': AdminController.addProduct,
    '/admin/userManager': AdminController.handlerUserByAdmin,
    '/admin/userManager/addUser': AdminController.addUser,
    '/user': UserController.handlerUserHomePage,
    '/user/filter': UserController.handlerFilterUserHomePage,
    '/user/profile': UserController.handlerUserProfilePage,
    '/product': ProductController.getDetailProduct
};

server.listen(PORT, 'localhost', () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})