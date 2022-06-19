"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class UsersController {
    constructor(users) {
        this.users = users;
    }
    Users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const method = req.method.toLowerCase();
                if (method === 'get') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(this.users));
                }
                if (method === 'post') {
                    let dataPromise = new Promise((resolve, reject) => {
                        try {
                            let body = '';
                            req.on('data', (chunk) => {
                                body += chunk.toString();
                            });
                            req.on('end', () => {
                                resolve(JSON.parse(body));
                            });
                        }
                        catch (error) {
                            res.writeHead(500);
                            res.end('HTTP/1.1 500 Internal Server Error\r\n\r\n', +error);
                        }
                    });
                    let data = yield dataPromise;
                    const isUserExist = this.users.find(user => user.id === data.id);
                    this.users.push(Object.assign({ id: (0, uuid_1.v4)() }, data));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                    // if (data && !isUserExist) {
                    //   this.users.push(data);
                    // res.writeHead(201, { 'Content-Type': 'application/json' });
                    // res.end(JSON.stringify(data));
                    // } else {
                    //   res.end(JSON.stringify(data));
                    // }
                }
                if (method === 'put') {
                }
            }
            catch (error) {
                res;
            }
        });
    }
    UserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = req.url.split('/').slice(-1)[0];
            const method = req.method.toLowerCase();
            try {
                if (method === 'get') {
                    if (!(0, uuid_1.validate)(param)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid id' }));
                        return;
                    }
                    const userData = this.users.find(user => user.id === param);
                    if (userData) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(userData));
                        return;
                    }
                    if (!userData) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `User with that id doesn't exist` }));
                        return;
                    }
                }
                if (method === 'put') {
                    if (!(0, uuid_1.validate)(param)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid id' }));
                        return;
                    }
                    const userData = this.users.find(user => user.id === param);
                    if (userData) {
                        let dataPromise = new Promise((resolve, reject) => {
                            try {
                                let body = '';
                                req.on('data', (chunk) => {
                                    body += chunk.toString();
                                });
                                req.on('end', () => {
                                    resolve(JSON.parse(body));
                                });
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                        let data = yield dataPromise;
                        let isUserExist = this.users.findIndex(user => user.id === param);
                        this.users[isUserExist] = Object.assign(Object.assign({}, this.users[isUserExist]), data);
                        console.log(isUserExist);
                        console.log(this.users);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(data));
                    }
                    if (!userData) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `User with that id doesn't exist` }));
                        return;
                    }
                }
                if (method === 'delete') {
                    if (!(0, uuid_1.validate)(param)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid id' }));
                        return;
                    }
                    const userData = this.users.find(user => user.id === param);
                    if (userData) {
                        let userIndex = this.users.findIndex(user => user.id === param);
                        if (userIndex > -1) {
                            this.users.splice(userIndex, 1);
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end('Successfully deleted');
                    }
                    if (!userData) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `User with that id doesn't exist` }));
                        return;
                    }
                }
            }
            catch (error) {
                res.writeHead(500);
                res.end('HTTP/1.1 500 Internal Server Error\r\n\r\n', +error);
            }
        });
    }
}
exports.default = UsersController;
