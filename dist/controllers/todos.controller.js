"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todosControllers = void 0;
const readFile_1 = require("../models/readFile");
const errors_1 = require("../utils/errors");
const validators_1 = require("../utils/validators");
const jwt_1 = require("../lib/jwt/jwt");
const writeFile_1 = require("../models/writeFile");
const { createToken, verifyToken } = jwt_1.tokenService;
class todosControllers {
    constructor() {
        this.POST_TODO = async function (req, res) {
            try {
                let newTodo = '';
                req.on("data", (chunk) => {
                    newTodo += chunk;
                });
                req.on("end", async () => {
                    try {
                        let todo = JSON.parse(newTodo);
                        let todos = await (0, readFile_1.readTodo)("todos.json");
                        const validator = (0, validators_1.todoValidator)(todo);
                        if (validator) {
                            const token = req.headers.token;
                            const verify_token = verifyToken(token);
                            todo.todo_title = (todo.todo_title.toLowerCase());
                            todo.isComplate = 1;
                            todo.todo_id = todos.length ? todos[todos.length - 1].todo_id + 1 : 1;
                            todo.user_id = verify_token.user_id;
                            todos.push(todo);
                            const save_todo = await (0, writeFile_1.writeTodo)("todos.json", todos);
                            if (!save_todo)
                                throw new errors_1.ServerError("Todo not saved");
                            const result = {
                                message: "Todo is saved",
                                status: 201,
                            };
                            res.statusCode = 201;
                            res.end(JSON.stringify(result));
                        }
                        ;
                    }
                    catch (error) {
                        let err = {
                            message: error.message,
                            status: error.status,
                        };
                        (0, errors_1.GlobalError)(res, err);
                    }
                });
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, errors_1.GlobalError)(res, err);
            }
        };
        this.GET_TODOS = async function (req, res) {
            try {
                const todos = await (0, readFile_1.readTodo)("todos.json");
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify(todos));
                console.log(todos);
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, errors_1.GlobalError)(res, err);
            }
        };
        this.GET_TODO = async function (req, res, reqUrl) {
            try {
                let id = reqUrl.split("/").at(-1);
                let todos = await (0, readFile_1.readTodo)("todos.json");
                if (typeof todos === "string") {
                    todos = JSON.parse(todos);
                }
                let index = todos.findIndex((todo) => todo.todo_id == Number(id));
                if (index < 0)
                    throw new errors_1.ClientError("Todo not found !", 404);
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify(todos[index]));
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, errors_1.GlobalError)(res, err);
            }
        };
        this.DELETE_TODO = async function (req, res, reqUrl) {
            try {
                try {
                    let todos = await (0, readFile_1.readFile)("todos.json");
                    let user = verifyToken(req.headers.token);
                    let todo = todos.find((u) => {
                        let id = req.url?.split("/").at(-1);
                        if (u.user_id == id)
                            return u;
                    });
                    let id = req.url?.split("/").at(-1);
                    if (user.user_id == todo?.user_id) {
                        let ChangedTodos = todos.filter((u) => u.user_id !== id);
                        await (0, writeFile_1.writeTodo)("todos.json", ChangedTodos);
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify({ message: "Todo deleted", status: 200 }));
                    }
                    ;
                }
                catch (error) {
                    let err = {
                        message: error.message,
                        status: error.status,
                    };
                    (0, errors_1.GlobalError)(res, err);
                }
            }
            catch (error) {
                let err = {
                    message: error.message,
                    status: error.status,
                };
                (0, errors_1.GlobalError)(res, err);
            }
        };
    }
}
exports.todosControllers = todosControllers;
;
exports.default = new todosControllers();
