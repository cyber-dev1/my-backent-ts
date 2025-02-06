import http, { IncomingMessage } from 'node:http' ;
import {METHODS_ENUM, ServerConfiguration} from "./config";
import userController from "./controllers/auth.controller";
import {Request, Response} from "./controllers/controller.dto"
import { checkToken } from './models/checkToken';
import todosControllers from './controllers/todos.controller';

const {PORT} = ServerConfiguration;

const server = http.createServer(async (req, res) => {
    const reqUrl = (req.url as string).trim().toLocaleLowerCase() ;
    const reqMethod = (req.method as string).trim().toUpperCase() ;
    res.setHeader("Content-type", "application/json");
    if(reqUrl.startsWith('/api')){
        if(reqUrl.startsWith('/api/auth/register') && reqMethod == METHODS_ENUM.CREATE) return userController.register(req, res);
        if(reqUrl.startsWith('/api/auth/login') && reqMethod == METHODS_ENUM.CREATE) return userController.login(req, res);
        if(await checkToken(req, res)){
            if(reqUrl.startsWith('/api/todos/create') && reqMethod == METHODS_ENUM.CREATE) return todosControllers.post_todos(req, res);
            if(reqUrl.startsWith('/api/todos/') && reqMethod == METHODS_ENUM.READ) return todosControllers.get_todo(req, res, reqUrl);
            if(reqUrl.startsWith('/api/todos') && reqMethod == METHODS_ENUM.READ) return todosControllers.get_todos(req, res);
            if(reqUrl.startsWith("/api/todo/") && reqMethod == METHODS_ENUM.DELETE) return  todosControllers.delete_todo(req,res , reqUrl);
        };

    }else return res.end(JSON.stringify({message:"Invalid URL", status : 404})) ;
});

server.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
})
