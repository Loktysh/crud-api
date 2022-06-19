"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const users_1 = __importDefault(require("./mock/users"));
const controller_1 = __importDefault(require("./controller"));
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_os_1 = require("node:os");
const node_process_1 = __importDefault(require("node:process"));
dotenv_1.default.config({ path: path_1.default.join(node_process_1.default.cwd(), '.env') });
dotenv_1.default.config({
    path: path_1.default.join(node_process_1.default.cwd(), '.env'),
});
let routes = {
    '/users': (req, res) => new controller_1.default(users_1.default).Users(req, res),
    '/users/(.*)': (req, res, method, param) => new controller_1.default(users_1.default).UserById(req, res),
};
let router = (client) => {
    let { req, res } = client;
    let users = users_1.default;
    const pathUrl = url_1.default.parse(req.url, true).path;
    if (pathUrl in routes) {
        routes[pathUrl](req, res);
        return null;
    }
    if (!routes[req.url]) {
        const route = Object.keys(routes).find((r, i) => {
            return !!pathUrl.match(new RegExp(`^${r}$`, 'i'));
        });
        if (route) {
            let pathHandler = routes[route];
            pathHandler(req, res);
        }
        else {
            res.writeHead(404).end('HTTP/1.1 404 Non-existing endpoint\r\n\r\n');
        }
    }
};
const numCPUs = (0, node_os_1.cpus)().length;
if (node_process_1.default.argv
    .filter(e => e.startsWith('multi'))[0].split('=')[1] == 'true') {
    if (node_cluster_1.default.isPrimary) {
        console.log(`Primary ${node_process_1.default.pid} is running`);
        for (let i = 0; i < numCPUs; i++) {
            node_cluster_1.default.fork();
        }
        node_cluster_1.default.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    }
    else {
        const server = http_1.default.createServer((req, res) => {
            router({ req, res });
        });
        server.on('clientError', (err, socket) => {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        server.listen(node_process_1.default.env.PORT || 8000, () => {
            console.log('Server listening on port:', node_process_1.default.env.PORT || 8001);
        });
        console.log(`Worker ${node_process_1.default.pid} started`);
    }
}
else {
    const server = http_1.default.createServer((req, res) => {
        router({ req, res });
    });
    server.on('clientError', (err, socket) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    server.listen(node_process_1.default.env.PORT || 8000, () => {
        console.log('Server listening on port:', node_process_1.default.env.PORT || 8001);
    });
}
