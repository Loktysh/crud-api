import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import path from 'path';
import { IndexType } from 'typescript';
import usersDB from './mock/users';
import UserController from './controller';
interface ProcessEnv {
  [key: string]: string | undefined;
}
import { IUser } from './types/interfaces';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

interface IRoutes {
  [key: string]: any;
}
let routes: IRoutes = {
  '/users': (req:any,res:any)=>new UserController(usersDB).Users(req, res ),
  '/users/(.*)': (req:any,res:any,method:string,param:any)=>new UserController(usersDB).UserById(req, res),
};
let router = (client: { req: any; res: any }): void => {
  let { req, res } = client;
  let users = usersDB;
  // console.log(new URL(req.url as string, `http://${req.headers.host}`));
  // console.log('req', url.parse(req.url, true));
  // console.log('/users'.match(routes[0]))
  const pathUrl = url.parse(req.url, true).path;
  // console.log(pathUrl);
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
    } else {
      res.writeHead(404).end('HTTP/1.1 404 Non-existing endpoint\r\n\r\n');
    }
  }
};
const server = http.createServer((req, res) => {
  router({ req, res });
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(process.env.PORT);
