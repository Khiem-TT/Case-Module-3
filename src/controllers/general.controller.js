const qs = require("qs");

const BaseController = require('./base.controller');
const generalModel = require('../models/general.model');

class GeneralController {

    static async getDataByForm(req, res) {
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        return qs.parse(data);
    }

    static async handlerLoginPage(req, res) {
        if (req.method === "GET") {
            await BaseController.writeFileData('./session/dataUser.json', '');
            let html = await BaseController.readFileData('./src/views/General/Login.html');
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            let user = await GeneralController.getDataByForm(req, res);
            let {username, password} = user;
            let infoUser = await generalModel.login(username, password);
            if (infoUser !== 0) {
                await BaseController.writeFileData('./session/dataUser.json', JSON.stringify(infoUser)).catch((err) => {
                    console.log(err.message)
                });
                let roleBuffer = infoUser.role;
                let role = roleBuffer.readUInt8(0);
                if (role === 1) {
                    console.log('Login success with role admin!');

                    res.writeHead(301, {location: '/admin'});
                    res.end();
                } else if (role === 0) {
                    console.log('Login success with role user!');
                    res.writeHead(301, {location: `/user`});
                    res.end();
                }
            } else {
                console.log('Login fail!');
                res.writeHead(301, {location: '/login'});
                res.end();
            }
        }
    }

    static async handlerRegister(req, res) {
        if (req.method === "GET") {
            let html = await BaseController.readFileData('./src/views/General/Register.html');
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            let data = await GeneralController.getDataByForm(req, res);
            let {name, email, phone, address, username, password} = data;

            let usernameExists = await generalModel.checkExistsAccount(username, email);
            if (!usernameExists) {
                await generalModel.registerAccount(username, password, name, phone, email, address);
                console.log('Register success!');
                res.writeHead(301, {location: '/login'});
                res.end();
            } else {
                console.log('Account was exists');
                res.writeHead(301, {location: '/register'});
                res.end();
            }
        }
    }

    static async getNotFoundPage(req, res) {
        let html = await BaseController.readFileData('./src/views/General/NotFound.html');
        res.writeHead(404, {'Content-type': 'text/html'});
        res.write(html);
        res.end();
    }
    static async readJSONfile(req, res) {
        let dataJSON = await BaseController.readFileData('./session/dataUser.json').catch(err => {
            console.log(err.message);
        });
        if (dataJSON !== '') {
            let data = JSON.parse(dataJSON.toString());
            return data;
        }
        else {
            res.writeHead(301, {location: '/login'});
            res.end();
        }
    }
}

module.exports = GeneralController;