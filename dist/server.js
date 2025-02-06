"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const config_1 = require("./config");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const checkToken_1 = require("./models/checkToken");
const todos_controller_1 = __importDefault(require("./controllers/todos.controller"));
const { PORT } = config_1.ServerConfiguration;
const server = node_http_1.default.createServer(async (req, res) => {
    const reqUrl = req.url.trim().toLocaleLowerCase();
    const reqMethod = req.method.trim().toUpperCase();
    res.setHeader("Content-type", "application/json");
    if (reqUrl.startsWith('/api')) {
        if (reqUrl.startsWith('/api/auth/register') && reqMethod == config_1.METHODS_ENUM.CREATE)
            return auth_controller_1.default.register(req, res);
        if (reqUrl.startsWith('/api/auth/login') && reqMethod == config_1.METHODS_ENUM.CREATE)
            return auth_controller_1.default.login(req, res);
        if (await (0, checkToken_1.checkToken)(req, res)) {
            if (reqUrl.startsWith('/api/todos/create') && reqMethod == config_1.METHODS_ENUM.CREATE)
                return todos_controller_1.default.post_todos(req, res);
            if (reqUrl.startsWith('/api/todos/') && reqMethod == config_1.METHODS_ENUM.READ)
                return todos_controller_1.default.get_todo(req, res, reqUrl);
            if (reqUrl.startsWith('/api/todos') && reqMethod == config_1.METHODS_ENUM.READ)
                return todos_controller_1.default.get_todos(req, res);
            if (reqUrl.startsWith("/api/todo/") && reqMethod == config_1.METHODS_ENUM.DELETE)
                return todos_controller_1.default.delete_todo(req, res, reqUrl);
        }
        ;
    }
    else
        return res.end(JSON.stringify({ message: "Invalid URL", status: 404 }));
});
server.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
