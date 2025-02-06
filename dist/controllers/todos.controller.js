"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todosControllers = void 0;
const readFile_1 = require("../models/readFile");
const errors_1 = require("../utils/errors");
const validators_1 = require("../utils/validators");
const controller_dto_1 = require("./controller.dto");
const jwt_1 = require("../lib/jwt/jwt");
const writeFile_1 = require("../models/writeFile");
const { createToken, verifyToken } = jwt_1.tokenService;
class todosControllers extends controller_dto_1.TodoRequests {
    get_todos(req, res) { }
    ;
    get_todo(req, res, reqUrl) { }
    ;
    post_todos(req, res) { }
    ;
    delete_todo(req, res, reqUrl) { }
    ;
    edit_todo(req, res) { }
    ;
    constructor() {
        super();
        this.post_todos = async function (req, res) {
            try {
                let todo_chunk = "";
                req.on("data", (chunk) => { todo_chunk += chunk; });
                req.on("end", async () => {
                    try {
                        const todo = JSON.parse(todo_chunk);
                        const todos = await ((0, readFile_1.readTodo)("todos.json"));
                        const validation_todo = new validators_1.todoValidation();
                        if (validation_todo.validation_create(todo)) {
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
                    }
                    catch (error) {
                        (0, errors_1.GlobalError)(res, error);
                    }
                });
            }
            catch (error) {
                (0, errors_1.GlobalError)(res, error);
            }
        };
        this.get_todos = async function (req, res) {
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
        this.get_todo = async function (req, res, reqUrl) {
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
        this.delete_todo = async function (req, res) {
            try {
                const todos = await ((0, readFile_1.readTodo)("todos.json"));
                const todo_id = Number(req.url.trim().split("/").at(-1));
                if (!todo_id)
                    throw new errors_1.ClientError("NOT FOUND", 404);
                const find_index_todo = todos.findIndex((t) => t.todo_id == todo_id);
                if (find_index_todo == -1)
                    throw new errors_1.ClientError("TODOS NOT FOUND", 404);
                const token = req.headers.token;
                const verify_token = verifyToken(token);
                const todo = todos[find_index_todo];
                if (todo.user_id != verify_token.user_id)
                    throw new errors_1.ClientError("Todo is not deleted", 400);
                todos.splice(find_index_todo, 1);
                const delete_todo = await (0, writeFile_1.writeTodo)("todos.json", todos);
                if (!delete_todo)
                    throw new errors_1.ServerError("Todo is not deleted");
                const result = {
                    message: "Todo is deleted",
                    status: 200,
                };
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            }
            catch (error) {
                (0, errors_1.GlobalError)(res, error);
            }
        };
        this.edit_todo = async function (req, res) {
            try {
                let todo_chunk = "";
                req.on("data", (chunk) => { todo_chunk += chunk; });
                req.on("end", async () => {
                    try {
                        const change_todo = JSON.parse(todo_chunk);
                        const todos = await ((0, readFile_1.readTodo)("todos.json"));
                        const validation_todo = new validators_1.todoValidation();
                        if (validation_todo.validation_edit(change_todo)) {
                            const todo_id = Number(req.url.trim().split("/").at(-1));
                            if (!todo_id)
                                throw new errors_1.ClientError("NOT FOUND OGabek", 404);
                            const find_index_todo = todos.findIndex((t) => t.todo_id == todo_id);
                            if (find_index_todo == -1)
                                throw new errors_1.ClientError("ogabek's Todo NOT FOUND", 404);
                            const token = req.headers.token;
                            const verify_token = verifyToken(token);
                            const todo = todos[find_index_todo];
                            if (todo.user_id != verify_token.user_id)
                                throw new errors_1.ClientError("Todo is not edit ogabek", 400);
                            todo.todo_title = change_todo.todo_title;
                            todo.isComplate = change_todo.isComplate;
                            const save_todo = await (0, writeFile_1.writeTodo)("todos.json", todos);
                            if (!save_todo)
                                throw new errors_1.ServerError("Todo is not changed ogabek");
                            const result = {
                                message: "Todo is changed",
                                status: 200,
                            };
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        }
                    }
                    catch (error) {
                        (0, errors_1.GlobalError)(res, error);
                    }
                });
            }
            catch (error) {
                (0, errors_1.GlobalError)(res, error);
            }
        };
    }
}
exports.todosControllers = todosControllers;
;
exports.default = new todosControllers();
