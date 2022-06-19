import { IUser } from './types/interfaces';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import url from 'url';
class UsersController {
  users: IUser[];
  constructor(users: IUser[]) {
    this.users = users;
  }
  async Users(req: any, res: any) {
    try {
      const method = req.method.toLowerCase();
    if (method === 'get') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(this.users));
    }
    if (method === 'post') {
      let dataPromise: any = new Promise((resolve, reject) => {
        try {
          let body = '';
          req.on('data', (chunk: string) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            resolve(JSON.parse(body));
          });
        } catch (error) {
          res.writeHead(500);
          res.end('HTTP/1.1 500 Internal Server Error\r\n\r\n', + error);
        }
      });
      let data = await dataPromise;
      const isUserExist = this.users.find(user => user.id === data.id);
      this.users.push({ id: uuidv4(), ...data });
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
    } catch (error) {
      res
    }
  }
  async UserById(req: any, res: any) {
    let param = req.url.split('/').slice(-1)[0];
    const method = req.method.toLowerCase();
   try {
    if (method === 'get') {
      if (!uuidValidate(param)) {
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
      if (!uuidValidate(param)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid id' }));
        return;
      }
      const userData = this.users.find(user => user.id === param);
      if (userData) {
        let dataPromise: any = new Promise((resolve, reject) => {
          try {
            let body = '';
            req.on('data', (chunk: string) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              resolve(JSON.parse(body));
            });
          } catch (error) {
            reject(error);
          }
        });
        let data = await dataPromise;
        let isUserExist = this.users.findIndex(user => user.id === param);
        this.users[isUserExist] = { ...this.users[isUserExist], ...data };
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
      if (!uuidValidate(param)) {
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
   } catch (error) {
    res.writeHead(500);
    res.end('HTTP/1.1 500 Internal Server Error\r\n\r\n', + error);
  }
  }
}

export default UsersController;
